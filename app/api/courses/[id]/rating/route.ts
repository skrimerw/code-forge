import { auth } from "@/auth";
import { RatingData } from "@/contexts/useRating";
import prisma from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const SetRatingSchema = z.object({
    rating: z.number(),
    userId: z.number(),
});

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]/rating">,
) {
    const body = await req.json();
    const courseId = Number((await ctx.params).id);
    const session = await auth();

    if (isNaN(courseId)) {
        return NextResponse.json(
            {
                message: "id must be a number",
            },
            {
                status: 400,
            },
        );
    }

    if (!session) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 403,
            },
        );
    }

    const { success, data, error } = SetRatingSchema.safeParse(body);

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

    const findCourse = await prisma.course.findFirst({
        where: {
            id: courseId,
        },
        include: {
            ratings: {
                where: {
                    courseId,
                    userId: session.user.id,
                },
            },
        },
    });

    if (!findCourse) {
        return NextResponse.json(
            {
                message: "Non-existent course",
            },
            {
                status: 400,
            },
        );
    }

    await prisma.rating.upsert({
        where: {
            id: findCourse.ratings?.[0]?.id || -1,
            courseId,
            userId: session.user.id,
        },
        create: {
            rating: data.rating,
            courseId,
            userId: session.user.id,
        },
        update: {
            rating: data.rating,
        },
    });

    const { _avg, _count } = await prisma.rating.aggregate({
        _avg: {
            rating: true,
        },
        _count: true,
        where: {
            courseId,
        },
    });

    const result: RatingData = {
        rating: _avg.rating ? _avg.rating : 0,
        reviewsCount: _count,
    };

    return NextResponse.json(result)
}
