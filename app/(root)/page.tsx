import { auth } from "@/auth";
import Container from "@/components/Container";
import ThemeCard from "@/components/ThemeCard";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";

export default async function Home() {
    const session = await auth();

    const modules = await prisma.module.findMany({
        orderBy: {
            order: "asc",
        },
        include: {
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
        <Container className="py-16">
            <div className="max-w-3xl mb-10">
                <h1 className="font-semibold text-4xl mb-2">
                    Темы для изучения
                </h1>
                <p className="text-typography-secondary">
                    Всё, что нужно знать о структурах данных и алгоритмах.
                    Списки, деревья, сортировки, графы и многое другое — от
                    основ до продвинутого уровня. Подойдёт для учёбы, практики и
                    подготовки к собеседованиям.
                </p>
            </div>

            {modules.map(({ id, themes, title }) => {
                return (
                    <section key={id}>
                        <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
                        <div className="flex gap-5">
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
                                                (totalSolved / totalTasks) * 100
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
        </Container>
    );
}
