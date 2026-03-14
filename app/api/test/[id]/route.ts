import { auth } from "@/auth";
import { TestBody, UserAnswers } from "@/lib/mock-test";
import prisma from "@/prisma/prisma-client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const UserAnswersSchema = z.object({
    answers: z.map(z.string(), z.number().or(z.array(z.number()))),
});

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/test/[id]">,
) {
    const body = await req.json();
    const id = Number((await ctx.params).id);
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const findTest = await prisma.testTask.findFirst({
        where: {
            id,
        },
        include: {
            testTaskSolutions: {
                where: {
                    userId: session.user.id,
                },
            },
        },
    });

    if (!findTest) {
        return NextResponse.json(
            { error: "This test doesn't exist" },
            { status: 400 },
        );
    }

    const score = getUserScore(
        body.answers as unknown as UserAnswers,
        findTest.body as TestBody,
    );

    if (!Array.isArray(findTest.body)) {
        throw new Error("Wrong type of test body");
    }

    const isSolved = score / findTest.body.length >= 0.66;

    await prisma.testTaskSolution.upsert({
        where: {
            id:
                findTest.testTaskSolutions.length === 0
                    ? -1
                    : findTest.testTaskSolutions[0].id,
        },
        create: {
            answersBody: body.answers,
            isSolved,
            userId: session.user.id,
            testTaskId: findTest.id,
        },
        update: {
            answersBody: body,
            isSolved,
        },
    });

    return NextResponse.json({ result: { score } });
}

function getUserScore(answers: UserAnswers, testBody: TestBody) {
    let userScore = 0;

    for (const key in answers) {
        const answer = answers[key];
        const actualAnswer = testBody.find(
            ({ id }) => id === Number(key),
        )?.actualAnswer;

        if (answer instanceof Array) {
            const answerSet = new Set(answer);
            const actualAnswerSet = new Set(
                actualAnswer === undefined || null
                    ? []
                    : (actualAnswer as number[]),
            );

            const rightAnswersAmount =
                answerSet.intersection(actualAnswerSet).size;

            if (rightAnswersAmount) {
                userScore += rightAnswersAmount / actualAnswerSet.size;
            }
        } else if (typeof answer === "number") {
            if (actualAnswer === answer) {
                userScore++;
            }
        } else {
            console.error("Invalid type of answer");
        }
    }

    return userScore;
}
