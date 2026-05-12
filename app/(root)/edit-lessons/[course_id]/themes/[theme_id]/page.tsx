import EditLessonForm from "@/components/edit-lessons/EditLessonForm";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function EditThemePage({
    params,
}: {
    params: Promise<{ theme_id: string }>;
}) {
    const themeId = Number((await params).theme_id);

    const theme = await prisma.theme.findFirst({
        where: {
            id: themeId,
        },
    });

    if (!theme) {
        notFound();
    }

    const codeTasks = await prisma.codeTask.findMany({
        where: {
            themeId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return (
        <div className="w-full">
            <h1 className="text-3xl font-medium mb-6">Настройки темы</h1>

            <EditLessonForm initialData={theme} codeTasks={codeTasks} />
        </div>
    );
}
