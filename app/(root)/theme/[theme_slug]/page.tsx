import { auth } from "@/auth";
import Container from "@/components/Container";
import TableOfContents from "@/components/TableOfContents";
import TaskCard from "@/components/TaskCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/prisma/prisma-client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const links = [
    {
        id: "heading_1",
        text: "Что такое массив в программировании",
    },
    {
        id: "heading_2",
        text: "Как создать массив и наполнить его данными",
    },
    {
        id: "heading_3",
        text: "Задания",
    },
];

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
                            __html: theme.content,
                        }}
                    ></article>
                    <section
                        aria-label="heading_3"
                        className="py-10 border-t border-b mt-10"
                    >
                        <h2 id="heading_3"></h2>
                        {theme.testTasks.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium text-xl mb-3">
                                    Тестовые задания
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {theme.testTasks.map(
                                        ({ id, title, slug, difficulty }) => {
                                            return (
                                                <TaskCard
                                                    key={id}
                                                    url={`/theme/${theme_slug}/task/${slug}`}
                                                    difficulty={difficulty}
                                                    title={title}
                                                    isSolved
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
                    <div className="flex items-center justify-between mt-7">
                        <Link
                            className="group flex items-center gap-3 transition-colors rounded-lg py-2 pr-4 pl-2 hover:bg-secondary"
                            href={"#"}
                        >
                            <ChevronLeft className="size-6!" />
                            <div className="flex flex-col">
                                <p className="text-xs text-typography-secondary w-fit">
                                    НАЗАД
                                </p>
                                <p className="group-hover:underline underline-offset-2 text-medium">
                                    О-Большое
                                </p>
                            </div>
                        </Link>
                        <Link
                            className="group flex items-center gap-3 transition-colors rounded-lg py-2 pr-2 pl-4 hover:bg-secondary"
                            href={"#"}
                        >
                            <div className="flex flex-col">
                                <p className="text-xs text-typography-secondary w-fit ml-auto">
                                    ДАЛЕЕ
                                </p>
                                <p className="group-hover:underline underline-offset-2 text-medium">
                                    Сортировки
                                </p>
                            </div>
                            <ChevronRight className="size-6!" />
                        </Link>
                    </div>
                </div>
                <TableOfContents headings={links} />
            </div>
        </Container>
    );
}
