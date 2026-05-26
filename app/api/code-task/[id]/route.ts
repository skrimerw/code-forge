import { auth } from "@/auth";
import { EditCodeTaskSchema } from "@/lib/schemas/code-task";
import prisma from "@/prisma/prisma-client";
import { Difficulty } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/code-task/[id]">,
) {
    const body = await req.json();
    const id = Number((await ctx.params).id);
    const user = (await auth())?.user;

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

    const findTask = await prisma.codeTask.findFirst({
        where: {
            id,
            theme: {
                module: {
                    course: {
                        userId: user?.id,
                    },
                },
            },
        },
    });

    if (!findTask) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { success, data, error } = EditCodeTaskSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            {
                message: z.treeifyError(error),
            },
            { status: 400 },
        );
    }

    await prisma.codeTask.update({
        where: {
            id,
        },
        data: {
            description: data.description,
            title: data.title,
            difficulty: data.difficulty as Difficulty,
            variants: {
                updateMany: {
                    where: {
                        codeTaskId: id,
                        lang: "JAVASCRIPT",
                    },
                    data: {
                        starterCode: data.initialCode,
                        test: data.testCode,
                    },
                },
            },
        },
    });

    return NextResponse.json({});
}
