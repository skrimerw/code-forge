import EditCourseForm from "@/components/my-courses/EditCourseForm";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function CoursePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    const course = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (!course) {
        notFound();
    }

    return <EditCourseForm className="max-w-3xl" />;
}
