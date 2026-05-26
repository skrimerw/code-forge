import { auth } from "@/auth";
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCodeTaskSuccessRate } from "@/lib/queries/success-rate-code-tasks";
import prisma from "@/prisma/prisma-client";
import { Check, Target } from "lucide-react";
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
    const session = await auth();

    const task = await prisma.codeTask.findFirst({
        where: {
            slug: task_id,
        },
        include: {
            theme: {
                include: {
                    module: {
                        include: {
                            course: true,
                        },
                    },
                },
            },
            variants: {
                include: {
                    codeTaskSolutions: {
                        where: {
                            userId: session?.user.id,
                        },
                    },
                },
            },
        },
    });

    if (!task) {
        notFound();
    }

    const successRate = await getCodeTaskSuccessRate(task.id);

    const isSolved = task.variants.find((variant) =>
        variant.codeTaskSolutions.find((solution) => solution.isSolved),
    );

    const course = task.theme.module.course;
    const successPercent = (successRate.success_rate * 100).toLocaleString(
        "ru-RU",
        {
            maximumFractionDigits: 2,
        },
    );
    return (
        <Container>
            <Breadcrumb>
                <BreadcrumbList className="gap-1!">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="text-base">
                                Курсы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                href={`/course/${course?.id}`}
                                className="text-base"
                            >
                                {course?.title}
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
            <div className="my-10 flex items-center gap-3">
                <DifficultyBadge
                    className="text-base border-2 px-3 w-[90px]"
                    difficulty={task.difficulty}
                />
                <h1 className="flex items-center gap-3 text-3xl font-semibold">
                    {task.title}

                    {isSolved && <Check />}
                </h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="ml-auto mr-4 flex items-center gap-1 font-medium w-fit">
                            <Target
                                className="text-foreground"
                                size={18}
                                strokeWidth={1.5}
                            />
                            {successPercent}%{" "}
                            <span className="font-normal">из</span>{" "}
                            {successRate.total_solutions}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-fit max-w-[250px] text-center">
                        {successPercent}% пользователей из{" "}
                        {successRate.total_solutions}, взявших это задание,
                        успешно решили его.
                    </TooltipContent>
                </Tooltip>
            </div>
            <CodeEditorWrapper
                themeTitle={task.theme.title}
                themeContent={task.theme.content}
                taskId={task.id}
                isSolved={!!isSolved}
                variants={task.variants}
                description={task.description}
            />
        </Container>
    );
}
