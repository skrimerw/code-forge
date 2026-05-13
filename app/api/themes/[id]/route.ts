import { EditLessonSchema, EditLessonType } from "@/lib/schemas/edit-lesson";
import { toSlug } from "@/lib/toSlug";
import prisma from "@/prisma/prisma-client";
import { CodeTask, Difficulty, Prisma, TestTask, Theme } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

async function updateCodeTasks(
    themeId: number,
    oldCodeTasks: CodeTask[],
    newCodeTasks: EditLessonType["codeTasks"],
) {
    const oldCodeTaskIdsSet = new Set(oldCodeTasks.map((task) => task.id));
    const newCodeTaskIdsSet = new Set();
    const allCodeTasks = [];

    for (const { difficulty, fakeId, title } of newCodeTasks) {
        const codeTaskUpserted = await prisma.codeTask.upsert({
            where: {
                id: fakeId,
            },
            create: {
                difficulty: difficulty as Difficulty,
                description: "",
                title: title,
                slug: toSlug(title),
                themeId: themeId,
                variants: {
                    create: {
                        lang: "JAVASCRIPT",
                        starterCode: "",
                        test: "",
                    },
                },
            },
            update: {
                difficulty: difficulty as Difficulty,
                title: title,
                slug: toSlug(title),
            },
        });

        newCodeTaskIdsSet.add(codeTaskUpserted.id);
        allCodeTasks.push(codeTaskUpserted);
    }

    const removeCodeTaskIds = oldCodeTaskIdsSet.difference(newCodeTaskIdsSet);

    for (const delCodeTaskId of removeCodeTaskIds) {
        await prisma.codeTask.delete({
            where: {
                id: delCodeTaskId,
            },
        });
    }

    return allCodeTasks;
}

async function updateTestTasks(
    themeId: number,
    oldTestTasks: TestTask[],
    newTestTasks: EditLessonType["testTasks"],
) {
    const oldTestTaskIdsSet = new Set(oldTestTasks.map((task) => task.id));
    const newTestTaskIdsSet = new Set();
    const allTestTasks = [];

    for (const { difficulty, fakeId, title } of newTestTasks) {
        const testTaskUpserted = await prisma.testTask.upsert({
            where: {
                id: fakeId,
            },
            create: {
                difficulty: difficulty as Difficulty,
                title: title,
                themeId: themeId,
                body: "",
            },
            update: {
                difficulty: difficulty as Difficulty,
                title: title,
            },
        });

        newTestTaskIdsSet.add(testTaskUpserted.id);
        allTestTasks.push(testTaskUpserted);
    }

    const removeCodeTaskIds = oldTestTaskIdsSet.difference(newTestTaskIdsSet);

    for (const delCodeTaskId of removeCodeTaskIds) {
        await prisma.testTask.delete({
            where: {
                id: delCodeTaskId,
            },
        });
    }

    return allTestTasks;
}

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/themes/[id]">,
) {
    const body = await req.json();
    const id = Number((await ctx.params).id);

    if (isNaN(id)) {
        return NextResponse.json(
            {
                message: "Invalid id",
            },
            {
                status: 400,
            },
        );
    }

    const { success, data, error } = EditLessonSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            {
                message: z.treeifyError(error),
            },
            { status: 400 },
        );
    }

    const { codeTasks, testTasks, ...themeData } = data;

    const updatedTheme = await prisma.theme.update({
        where: {
            id,
        },
        data: themeData,
        include: {
            codeTasks: true,
            testTasks: true,
        },
    });

    const allCodeTasks = await updateCodeTasks(
        updatedTheme.id,
        updatedTheme.codeTasks,
        codeTasks,
    );

    const allTestTasks = await updateTestTasks(
        updatedTheme.id,
        updatedTheme.testTasks,
        testTasks,
    );

    return NextResponse.json({
        ...updatedTheme,
        codeTasks: allCodeTasks,
        testTasks: allTestTasks,
    });
}
