import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import redisClient from "@/lib/redis";
import { Output, QueueSandboxJob } from "@/types";
import { Language } from "@prisma/client";

const RunCodeSchema = z.object({
    lang: z
        .string()
        .toLowerCase()
        .refine(
            (data) => {
                if (data === "javascript" || data === "python") return true;
            },
            {
                error: "Unsupported language",
            },
        )
        .nonempty("'lang' option is required"),
    code: z.string().nonempty("'code' option is required"),
});

/**
 * Запускает произвольный код пользователя
 * без проведения тестирования кода
 *
 * @param req
 * @returns
 */

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = RunCodeSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { error: z.treeifyError(error) },
            { status: 400 },
        );
    }

    try {
        const job: QueueSandboxJob = {
            id: Date.now(),
            code: data.code,
            lang: data.lang as Language,
        };

        await redisClient.lPush("docker-queue", JSON.stringify(job));

        let result: Output;

        while (true) {
            const res: Output = (await redisClient.hGetAll(
                `result:${job.id}`,
            )) as unknown as Output;

            if (Object.keys(res).length > 0) {
                result = res;

                await redisClient.del(`result:${job.id}`);

                break;
            }
        }

        return NextResponse.json<Output>({
            ...result,
            timedOut:
                result.timedOut === ("1" as unknown as boolean) ? true : false,
            code: Number(result.code),
        });
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({});
}
