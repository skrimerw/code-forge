import { auth } from "@/auth";
import { CreateCourseSchema } from "@/lib/schemas/course";
import prisma from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { success, data, error } = CreateCourseSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            {
                message: z.treeifyError(error),
            },
            {
                status: 400,
            },
        );
    }

    const newCourse = await prisma.course.create({
        data: {
            status: "IN_PROGRESS",
            title: data.title,
            userId: session.user.id,
        },
    });

    return NextResponse.json(newCourse);
}
