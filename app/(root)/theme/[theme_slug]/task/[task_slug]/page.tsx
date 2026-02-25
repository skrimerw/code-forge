import CodeEditorWrapper from "@/components/CodeEditorWrapper";
import Container from "@/components/Container";
import DifficultyBadge from "@/components/DifficultyBadge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/prisma/prisma-client";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function CodeEditorPage({
    params,
}: {
    params: Promise<{ task_slug: string; theme_slug: string }>;
}) {
    const task_id = (await params).task_slug;
    const theme_id = (await params).theme_slug;

    const task = await prisma.codeTask.findFirst({
        where: {
            slug: task_id,
        },
        include: {
            theme: {
                select: {
                    title: true,
                },
            },
        },
    });

    if (!task) {
        notFound();
    }

    return (
        <Container>
            <Breadcrumb>
                <BreadcrumbList className="gap-1!">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="text-base">
                                Темы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                href={`/theme/${theme_id}`}
                                className="text-base"
                            >
                                {task.theme.title}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-base">
                            {task.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="my-10 flex items-center gap-4">
                <DifficultyBadge
                    className="text-base border-2 px-3"
                    difficulty={task.difficulty}
                />
                <h1 className="text-3xl font-semibold">{task.title}</h1>
            </div>

            <CodeEditorWrapper description={task.description} />
        </Container>
    );
}
