import EditCodeTaskForm from "@/components/edit-code-task/EditCodeTaskForm";
import EditTestTaskForm from "@/components/edit-test-task/EditTestTaskForm";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function TestTaskPage({
    params,
}: {
    params: Promise<{ task_id: string }>;
}) {
    const taskId = Number((await params).task_id);

    const task = await prisma.testTask.findFirst({
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

    return <EditTestTaskForm themeTitle={task.theme.title} task={task} />;
}
