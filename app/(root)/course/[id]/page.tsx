import { auth } from "@/auth";
import Container from "@/components/Container";
import ThemeCard from "@/components/ThemeCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CoursePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const id = Number((await params).id);

    const modules = await prisma.module.findMany({
        where: {
            courseId: id,
        },
        orderBy: {
            order: "asc",
        },
        include: {
            course: true,
            themes: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    codeTasks: {
                        include: {
                            variants: {
                                include: {
                                    codeTaskSolutions: {
                                        where: {
                                            userId: session?.user.id,
                                            isSolved: true,
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
                                    isSolved: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!modules) {
        notFound();
    }

    function countSolvedTestTasks(
        tasks: Prisma.TestTaskGetPayload<{
            include: { testTaskSolutions: true };
        }>[],
    ) {
        return tasks.reduce((currentSum, task) => {
            return currentSum + task.testTaskSolutions.length;
        }, 0);
    }

    function countSolvedCodeTasks(
        tasks: Prisma.CodeTaskGetPayload<{
            include: {
                variants: {
                    include: {
                        codeTaskSolutions: true;
                    };
                };
            };
        }>[],
    ) {
        return tasks.reduce((currentSum, task) => {
            const hasSolved = task.variants.find(({ codeTaskSolutions }) => {
                return codeTaskSolutions.find(
                    ({ isSolved }) => isSolved === true,
                );
            });

            return currentSum + (hasSolved ? 1 : 0);
        }, 0);
    }

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
                        <BreadcrumbPage className="text-base">
                            {modules[0].course.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="max-w-3xl my-10">
                <h1 className="font-semibold text-4xl mb-2">
                    {modules[0].course.title}
                </h1>
                <p className="text-typography-secondary">
                    {modules[0].course.description}
                </p>
            </div>

            <div className="flex flex-col gap-16">
                {modules.map(({ id, themes, title }) => {
                    return (
                        <section key={id}>
                            <h2 className="mb-5 text-2xl font-semibold">
                                {title}
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {themes.map(
                                    ({
                                        id,
                                        description,
                                        slug,
                                        title,
                                        imageUrl,
                                        codeTasks,
                                        testTasks,
                                    }) => {
                                        const solvedCodeTasks =
                                            countSolvedCodeTasks(codeTasks);
                                        const solvedTestTasks =
                                            countSolvedTestTasks(testTasks);
                                        const totalSolved =
                                            solvedCodeTasks + solvedTestTasks;
                                        const totalTasks =
                                            codeTasks.length + testTasks.length;

                                        return (
                                            <ThemeCard
                                                key={id}
                                                slug={slug}
                                                description={description}
                                                imageUrl={imageUrl}
                                                progress={
                                                    (totalSolved / totalTasks) *
                                                    100
                                                }
                                                title={title}
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </Container>
    );
}
