import EditCodeTaskForm from "@/components/edit-code-task/EditCodeTaskForm";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function CodeTaskPage({
    params,
}: {
    params: Promise<{ task_id: string }>;
}) {
    const taskId = Number((await params).task_id);

    const task = await prisma.codeTask.findFirst({
        where: {
            id: taskId,
        },
        include: {
            theme: true,
        },
    });

    if (!task) {
        notFound();
    }

    const variant = await prisma.codeTaskVariant.findFirst({
        where: {
            lang: "JAVASCRIPT",
            codeTaskId: taskId,
        },
    });

    return (
        <EditCodeTaskForm
            task={task}
            themeTitle={task.theme.title}
            initialCode={variant?.starterCode || ""}
            testCode={variant?.test || ""}
        />
    );
}
