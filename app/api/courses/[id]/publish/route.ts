import { runCheckList } from "@/actions/runCheckList";
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

    const { checkOptionsPodacha, checkOptionsStructure } =
        await runCheckList(id);

    const podachaKeys = Object.keys(checkOptionsPodacha);
    const structureKeys = Object.keys(checkOptionsStructure);
    const podachaValues = Object.values(checkOptionsPodacha);
    const structureValues = Object.values(checkOptionsStructure);

    const totalOptionsCount = podachaKeys.length + structureKeys.length;
    const validOptionsCount =
        podachaValues.filter((option) => option.isValid).length +
        structureValues.filter((option) => option.isValid).length;

    if (totalOptionsCount !== validOptionsCount) {
        return NextResponse.json(
            { message: "Check list not passed" },
            { status: 400 },
        );
    }

    const publishedCourse = await prisma.course.update({
        where: {
            id,
        },
        data: {
            status: "PUBLISHED",
        },
    });

    return NextResponse.json(publishedCourse);
}
