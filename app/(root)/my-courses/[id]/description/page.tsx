import EditCourseForm from "@/components/my-courses/EditCourseForm";
import OpenSheet from "@/components/my-courses/OpenSheet";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function CoursePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    if (isNaN(Number(id))) {
        notFound();
    }

    const course = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (!course) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-medium mb-4">
                <OpenSheet className="mr-2" />
                Описание
            </h1>
            <EditCourseForm className="lg:max-w-3xl" />
        </div>
    );
}
