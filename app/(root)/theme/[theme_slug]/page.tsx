import { auth } from "@/auth";
import Container from "@/components/Container";
import TableOfContents from "@/components/TableOfContents";
import TaskCard from "@/components/TaskCard";
import TestTaskCard from "@/components/TestTaskCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getTableOfContentsFromHTML } from "@/lib/getToC";
import { TestBody } from "@/lib/mock-test";
import prisma from "@/prisma/prisma-client";
import { Theme } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function TheoryPage({
    params,
}: {
    params: Promise<{ theme_slug: string }>;
}) {
    const theme_slug = (await params).theme_slug;

    const session = await auth();

    const theme = await prisma.theme.findFirst({
        where: {
            slug: theme_slug,
        },
        include: {
            module: true,
            codeTasks: {
                include: {
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
            },
            testTasks: {
                include: {
                    testTaskSolutions: {
                        where: {
                            userId: session?.user.id,
                        },
                    },
                },
            },
        },
    });

    if (!theme) {
        notFound();
    }

    const course = await prisma.course.findFirst({
        where: {
            id: theme.module.courseId,
        },
        include: {
            modules: {
                include: {
                    themes: true,
                },
            },
        },
    });

    const themes: Theme[] = [];

    course?.modules.forEach((module) => themes.push(...module.themes));

    const currentThemeIndex = themes.findIndex(({ id }) => theme.id === id);

    const prev = themes[currentThemeIndex - 1];
    const next = themes[currentThemeIndex + 1];

    const { html, toc: links } = await getTableOfContentsFromHTML(
        theme.content,
    );

    links.push({
        id: "tasks",
        text: "Задания",
    });

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
                        <BreadcrumbPage className="text-base">
                            {theme.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-semibold my-10">{theme.title}</h1>
            <div className="flex gap-14">
                <div className="article-content">
                    <article
                        className="article-container"
                        dangerouslySetInnerHTML={{
                            __html: html || "",
                        }}
                    ></article>
                    <section
                        aria-label="tasks"
                        className="py-10 border-t border-b mt-10"
                    >
                        <h2 id="tasks"></h2>
                        {theme.testTasks.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium text-xl mb-3">
                                    Тестовые задания
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {theme.testTasks.map(
                                        ({
                                            id,
                                            title,
                                            difficulty,
                                            testTaskSolutions,
                                            body,
                                        }) => {
                                            return (
                                                <TestTaskCard
                                                    key={id}
                                                    id={id}
                                                    testBody={body as TestBody}
                                                    difficulty={difficulty}
                                                    title={title}
                                                    isSolved={
                                                        testTaskSolutions?.[0]
                                                            ?.isSolved
                                                    }
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        )}

                        {theme.codeTasks.length > 0 && (
                            <div>
                                <h3 className="font-medium text-xl mb-3">
                                    Практические задания
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {theme.codeTasks.map(
                                        ({
                                            id,
                                            slug,
                                            title,
                                            difficulty,
                                            variants,
                                        }) => {
                                            return (
                                                <TaskCard
                                                    key={id}
                                                    url={`/theme/${theme_slug}/task/${slug}`}
                                                    difficulty={difficulty}
                                                    title={title}
                                                    isSolved={
                                                        variants.find(
                                                            ({
                                                                codeTaskSolutions,
                                                            }) => {
                                                                return codeTaskSolutions.find(
                                                                    ({
                                                                        isSolved,
                                                                    }) =>
                                                                        isSolved ===
                                                                        true,
                                                                );
                                                            },
                                                        )?.codeTaskSolutions[0]
                                                            .isSolved
                                                    }
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                    <div className="grid grid-cols-2 gap-4 items-center justify-between mt-7">
                        {prev && (
                            <Link
                                className="mr-auto col-start-1 w-full group flex items-center gap-3 transition-colors rounded-lg py-6 px-5 hover:bg-secondary max-w-xs"
                                href={`/theme/${prev.slug}`}
                            >
                                <ChevronLeft className="size-6!" />
                                <div className="flex flex-col">
                                    <p className="text-xs text-typography-secondary w-fit">
                                        НАЗАД
                                    </p>
                                    <p className="group-hover:underline underline-offset-2 text-medium">
                                        {prev?.title}
                                    </p>
                                </div>
                            </Link>
                        )}
                        {next && (
                            <Link
                                className="ml-auto col-start-2 w-full group flex items-center justify-end gap-3 transition-colors rounded-lg py-6 px-5 hover:bg-secondary max-w-xs"
                                href={`/theme/${next.slug}`}
                            >
                                <div className="flex flex-col">
                                    <p className="text-xs text-typography-secondary w-fit ml-auto">
                                        ДАЛЕЕ
                                    </p>
                                    <p className="group-hover:underline underline-offset-2 text-medium">
                                        {next?.title}
                                    </p>
                                </div>
                                <ChevronRight className="size-6!" />
                            </Link>
                        )}
                    </div>
                </div>
                <TableOfContents headings={links} />
            </div>
        </Container>
    );
}
