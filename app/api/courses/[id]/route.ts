import { auth } from "@/auth";
import prisma from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function DELETE(
    _req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]">,
) {
    const id = (await ctx.params).id;
    const user = (await auth())?.user;

    const findCourse = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (findCourse?.userId !== user?.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.course.delete({
        where: {
            id: Number(id),
        },
    });

    return NextResponse.json({});
}

export const EditCourseSchema = z.object({
    title: z.string().nonempty("Пожалуйста введите название"),
    description: z.string(),
});

export async function PUT(
    req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]">,
) {
    const body = await req.json();
    const id = (await ctx.params).id;
    const user = (await auth())?.user;

    const findCourse = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (findCourse?.userId !== user?.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { success, data, error } = EditCourseSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { message: z.treeifyError(error) },
            { status: 400 },
        );
    }

    const updatedCourse = await prisma.course.update({
        where: {
            id: Number(id),
        },
        data: data,
    });

    return NextResponse.json(updatedCourse);
}
