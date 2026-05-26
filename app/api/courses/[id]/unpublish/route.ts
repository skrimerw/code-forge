import { auth } from "@/auth";
import prisma from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    _req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]/publish">,
) {
    const id = Number((await ctx.params).id);
    const user = (await auth())?.user;

    if (isNaN(id)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const findCourse = await prisma.course.findFirst({
        where: {
            id,
            userId: user?.id,
        },
    });

    if (!findCourse) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const publishedCourse = await prisma.course.update({
        where: {
            id,
        },
        data: {
            status: "IN_PROGRESS",
        },
    });

    return NextResponse.json(publishedCourse);
}
