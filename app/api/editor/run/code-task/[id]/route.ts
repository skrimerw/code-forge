import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import redisClient from "@/lib/redis";
import prisma from "@/prisma/prisma-client";
import { Language } from "@prisma/client";
import { Output, QueueCodeTaskJob, TestRunResult, TestSuite } from "@/types";
import { auth } from "@/auth";
import { hasTestsPassed } from "@/lib/utils";

const RunCodeSchema = z.object({
    lang: z
        .string()
        .toUpperCase()
        .refine(
            (data) => {
                if (data === "JAVASCRIPT" || data === "PYTHON") return true;
            },
            {
                error: "Unsupported language",
            },
        )
        .nonempty("'lang' option is required"),
    code: z.string().nonempty("'code' option is required"),
});

/**
 * Запускает код пользователя из задания
 * с проведением тестирования кода
 *
 * @param req
 * @returns
 */

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/editor/run/code-task/[id]">,
) {
    const body = await req.json();
    const id = Number((await ctx.params).id);
    const session = await auth();

    const { success, data, error } = RunCodeSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { error: z.treeifyError(error) },
            { status: 400 },
        );
    }

    if (!session?.user) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    const codeTaskVariant = await prisma.codeTaskVariant.findFirst({
        where: {
            codeTaskId: id,
            lang: data.lang as Language,
        },
        include: {
            codeTaskSolutions: {
                where: {
                    userId: session.user.id,
                },
            },
        },
    });

    if (!codeTaskVariant) {
        return NextResponse.json(
            {
                message:
                    "This task variant doesn't exist. Change either 'lang' and/or 'taskId'",
            },
            { status: 400 },
        );
    }

    try {
        const job: QueueCodeTaskJob = {
            id: Date.now(),
            code: data.code,
            lang: data.lang as Language,
            test: codeTaskVariant.test,
        };

        await redisClient.lPush("code-task-queue", JSON.stringify(job));

        let result: TestRunResult & Output;

        while (true) {
            const res: TestRunResult & Output = (await redisClient.hGetAll(
                `result:${job.id}`,
            )) as unknown as TestRunResult & Output;

            if (Object.keys(res).length > 0) {
                result = res;

                await redisClient.del(`result:${job.id}`);

                break;
            }
        }

        const tests = JSON.parse(result.tests as unknown as string)
        const allTestsPassed = hasTestsPassed(tests);
        const isSolved =
            !result.stderr && !tests.length ? false : allTestsPassed;

        if (codeTaskVariant.codeTaskSolutions.length) {
            await prisma.codeTaskSolution.update({
                data: {
                    isSolved,
                    code: data.code,
                },
                where: {
                    id: codeTaskVariant.codeTaskSolutions[0].id,
                },
            });
        } else {
            await prisma.codeTaskSolution.create({
                data: {
                    code: data.code,
                    lang: data.lang as Language,
                    isSolved,
                    codeTaskVariantId: codeTaskVariant.id,
                    userId: session.user.id,
                },
            });
        }

        return NextResponse.json<TestRunResult & Output>({
            ...result,
            tests,
            timedOut:
                result.timedOut === ("1" as unknown as boolean) ? true : false,
            code: !allTestsPassed ? 1 : Number(result.code),
        });
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({});
}
