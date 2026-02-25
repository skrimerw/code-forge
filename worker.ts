import { spawn } from "child_process";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { createClient } from "redis";

const KILL_AFTER = 12000; // Время, после которого останавливается докер-контейнер

function getFullDate(date: number) {
    const dateIns = new Date(date);
    const hours = makeFullNumber(dateIns.getHours());
    const minutes = makeFullNumber(dateIns.getMinutes());
    const seconds = makeFullNumber(dateIns.getSeconds());

    const day = makeFullNumber(dateIns.getDate());
    const month = makeFullNumber(dateIns.getUTCMonth() + 1);
    const year = makeFullNumber(dateIns.getFullYear());

    function makeFullNumber(num: number) {
        return String(num).length === 1 ? "0" + num : num;
    }

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function runDocker(
    dockerContainerName: string,
    mountSrc: string,
    fileName: string,
    lang: string,
): Promise<Omit<Output, "time">> {
    return new Promise(async (resolve) => {
        const docker = spawn("docker", [
            "run",
            "--rm",
            "--network=none",
            "--memory=128m",
            "--cpus=0.5",
            "--pids-limit=64",
            "--read-only",
            "--security-opt=no-new-privileges",
            "--name=" + dockerContainerName,
            "--mount",
            "src=" + mountSrc + ",target=/home/isolated-user,type=bind",
            "-e",
            "CODE_FORGE_FILE_NAME=" + fileName,
            "isolated-" + lang,
        ]);

        let stdout = "";
        let stderr = "";
        let timedOut: any;

        docker.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        docker.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        docker.on("spawn", () => {
            setTimeout(() => {
                spawn("docker", ["stop", dockerContainerName]);

                timedOut = true;
                stderr = `Execution Timed Out (${KILL_AFTER} ms)`;
            }, KILL_AFTER);
        });

        docker.on("close", (code) => {
            switch (code) {
                case 137:
                    code = 1;
                    break;
                case null:
                    code = 0;
            }

            resolve({
                stdout,
                stderr,
                code,
                timedOut,
            });
        });
    });
}

const redisClient = createClient();

async function start() {
    console.log("Started worker...");

    while (true) {
        const jobStr = await redisClient.brPop("docker-queue", 50);

        if (!jobStr?.element) continue;

        const { code, id, lang }: QueueJob = JSON.parse(jobStr.element);

        let ext: string = "";

        switch (lang) {
            case "javascript":
                ext = "js";
                break;
            case "python":
                ext = "py";
                break;
        }

        if (ext === "") continue;

        const fileName = `${id}.${ext}`;

        const dirPath = `./isolated-volume/${ext}`;
        const filePath = `${dirPath}/${fileName}`;

        if (!fs.existsSync(dirPath)) {
            await fsPromises.mkdir("./isolated-volume/" + ext, {
                recursive: true,
            });
        }

        await fsPromises.writeFile(filePath, code, {
            encoding: "utf-8",
        });

        const mountSrc = path.join(
            await fsPromises.realpath("./"),
            `isolated-volume/${ext}`,
        );
        const dockerContainerName = `${lang}-${id}`;

        const start = Date.now();

        console.log(`\nStarted running ${fileName} at ${getFullDate(start)}`);

        const result = await runDocker(
            dockerContainerName,
            mountSrc,
            fileName,
            lang,
        );
        const end = Date.now();

        console.log(`Ended running ${fileName} at ${getFullDate(end)}`);

        await fsPromises.rm(filePath);

        await redisClient
            .multi()
            .hSet(`result:${id}`, "stderr", result.stderr.trim())
            .hSet(`result:${id}`, "stdout", result.stdout.trim())
            .hSet(`result:${id}`, "code", result.code)
            .hSet(`result:${id}`, "timedOut", result.timedOut ? 1 : 0)
            .hSet(`result:${id}`, "time", end - start)
            .exec();
    }
}

try {
    redisClient.connect();

    start();
} catch (e) {
    console.error("Worker crashed");
}
