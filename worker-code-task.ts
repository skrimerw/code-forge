import { spawn } from "child_process";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { createClient } from "redis";
import { Output, QueueCodeTaskJob, TestRunResult } from "./types";
import { rimraf } from "rimraf";

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
    lang: string,
): Promise<TestRunResult & Omit<Output, "time">> {
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
            "src=" + mountSrc + ",target=/home/isolated-user/src,type=bind",
            "isolated-code-task-" + lang,
        ]);

        let result: TestRunResult;
        let timedOut: any;

        docker.stdout.on("data", (data) => {
            const dataStr = data.toString();
            let jsonData: TestRunResult;

            try {
                jsonData = JSON.parse(dataStr);
                result = jsonData;
            } catch (e) {
                result.stdout += dataStr;
            }
        });

        docker.stderr.on("data", (data) => {
            result.stderr += data.toString();
        });

        docker.on("spawn", () => {
            setTimeout(() => {
                spawn("docker", ["stop", dockerContainerName]);

                timedOut = true;
                result.stderr = `Execution Timed Out (${KILL_AFTER} ms)`;
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
                ...result,
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
        const jobStr = await redisClient.brPop("code-task-queue", 50);

        if (!jobStr?.element) continue;

        const { code, id, lang, test }: QueueCodeTaskJob = JSON.parse(
            jobStr.element,
        );

        let ext: string = "";

        switch (lang) {
            case "JAVASCRIPT":
                ext = "js";
                break;
            case "PYTHON":
                ext = "py";
                break;
        }

        if (ext === "") continue;

        const fileName = `code.${ext}`;
        const testFileName = `code.test.${ext}`;

        const dirPath = `./isolated-volume/${ext}/${id}`;
        const filePath = `${dirPath}/${fileName}`;
        const testFilePath = `${dirPath}/${testFileName}`;

        if (!fs.existsSync(dirPath)) {
            await fsPromises.mkdir(dirPath, {
                recursive: true,
            });
        }

        await fsPromises.writeFile(filePath, code, {
            encoding: "utf-8",
        });

        await fsPromises.writeFile(testFilePath, test, {
            encoding: "utf-8",
        });

        const mountSrc = path.join(await fsPromises.realpath("./"), dirPath);
        const dockerContainerName = `${lang}-${id}`;

        const start = Date.now();

        console.log(`\nStarted running ${fileName} at ${getFullDate(start)}`);

        const result = await runDocker(
            dockerContainerName,
            mountSrc,
            lang.toLocaleLowerCase(),
        );
        const end = Date.now();

        console.log(`Ended running ${fileName} at ${getFullDate(end)}`);

        await rimraf(dirPath);

        await redisClient
            .multi()
            .hSet(`result:${id}`, "stderr", result.stderr.trim())
            .hSet(`result:${id}`, "stdout", result.stdout.trim())
            .hSet(`result:${id}`, "code", result.code)
            .hSet(`result:${id}`, "tests", JSON.stringify(result.tests))
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
