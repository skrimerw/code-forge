import { EditLessonSchema } from "@/lib/schemas/edit-lesson";
import { toSlug } from "@/lib/toSlug";
import prisma from "@/prisma/prisma-client";
import { Difficulty } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

    const { codeTasks, ...themeData } = data;

    const updatedTheme = await prisma.theme.update({
        where: {
            id,
        },
        data: themeData,
        include: {
            codeTasks: true,
        },
    });

    const oldCodeTaskIdsSet = new Set(
        updatedTheme.codeTasks.map((task) => task.id),
    );
    const newCodeTaskIdsSet = new Set();
    const allCodeTasks = [];

    for (const { difficulty, fakeId, title } of codeTasks) {
        const codeTaskUpserted = await prisma.codeTask.upsert({
            where: {
                id: fakeId,
            },
            create: {
                difficulty: difficulty as Difficulty,
                description: "",
                title: title,
                slug: toSlug(title),
                themeId: updatedTheme.id,
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

    return NextResponse.json({ ...updatedTheme, codeTasks: allCodeTasks });
}
