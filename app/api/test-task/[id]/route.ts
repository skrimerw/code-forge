import { EditTestTaskSchema } from "@/lib/schemas/test-task";
import prisma from "@/prisma/prisma-client";
import { Difficulty } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/test-task/[id]">,
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

    const { success, data, error } = EditTestTaskSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            {
                message: z.treeifyError(error),
            },
            { status: 400 },
        );
    }

    await prisma.testTask.update({
        where: {
            id,
        },
        data: {
            title: data.title,
            difficulty: data.difficulty as Difficulty,
            body: data.body,
        },
    });

    return NextResponse.json({});
}
