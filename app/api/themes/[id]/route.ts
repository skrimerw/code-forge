import { saveEditorImages, storeFile } from "@/actions/save-editor-images";
import { EditLessonSchema, EditLessonType } from "@/lib/schemas/edit-lesson";
import { toSlug } from "@/lib/toSlug";
import prisma from "@/prisma/prisma-client";
import { CodeTask, Difficulty, TestTask } from "@prisma/client";
import { randomBytes } from "crypto";
import { rm } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import mime from "mime";
import path from "path";
import z from "zod";
import { Question } from "@/lib/mock-test";

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

    const emptyTest: Question[] = [
        {
            id: 1,
            title: "",
            type: "singular",
            actualAnswer: 1,
            answers: [
                {
                    id: 1,
                    label: "",
                },
                {
                    id: 2,
                    label: "",
                },
                {
                    id: 3,
                    label: "",
                },
                {
                    id: 4,
                    label: "",
                },
            ],
        },
    ];

    for (const { difficulty, fakeId, title } of newTestTasks) {
        const testTaskUpserted = await prisma.testTask.upsert({
            where: {
                id: fakeId,
            },
            create: {
                difficulty: difficulty as Difficulty,
                title: title,
                themeId: themeId,
                body: emptyTest,
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

export async function PUT(
    req: NextRequest,
    ctx: RouteContext<"/api/themes/[id]">,
) {
    const formData = await req.formData();
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

    const findTheme = await prisma.theme.findFirst({
        where: {
            id,
        },
    });

    if (!findTheme) {
        return NextResponse.json(
            { message: "This record doesn't exist" },
            { status: 400 },
        );
    }

    const body = {
        logo: formData.get("logo"),
        title: formData.get("title"),
        description: formData.get("description"),
        content: formData.get("content"),
        codeTasks: JSON.parse(formData.get("codeTasks")?.toString() || ""),
        testTasks: JSON.parse(formData.get("testTasks")?.toString() || ""),
    };

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

    const parsedHtml = await saveEditorImages(themeData.content);

    let iconPath = "";

    if (data.logo instanceof File) {
        const ext = mime.getExtension(data.logo.type);
        const fileName = `${randomBytes(16).toString("hex")}.${ext}`;

        if (!data.logo.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "icon must be an image" },
                { status: 400 },
            );
        }

        await storeFile(
            "./public/uploads/themes",
            fileName,
            Buffer.from(await data.logo.arrayBuffer()),
        );

        const oldUrl = findTheme.imageUrl;

        if (oldUrl) {
            try {
                await rm(path.join("./public", oldUrl));
            } catch (e) {
                console.log(e);
            }
        }

        iconPath = "/uploads/themes/" + fileName;
    }

    if (typeof data.logo === "string") {
        iconPath = data.logo;
    }

    const { logo, ...updateData } = themeData;

    const updatedTheme = await prisma.theme.update({
        where: {
            id,
        },
        data: { ...updateData, imageUrl: iconPath, content: parsedHtml },
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
