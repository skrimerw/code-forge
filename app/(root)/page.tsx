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
                            belongsToUser: {
                                where: {
                                    userId: session?.user.id,
                                    isSolved: true,
                                },
                            },
                        },
                    },

                    testTasks: {
                        include: {
                            belongsToUser: {
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

    function countSolvedTasks(
        tasks:
            | Prisma.CodeTaskGetPayload<{
                  include: { belongsToUser: true };
              }>[]
            | Prisma.TestTaskGetPayload<{
                  include: { belongsToUser: true };
              }>[],
    ) {
        return tasks.reduce((currentSum, task) => {
            return currentSum + task.belongsToUser.length;
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
                                        countSolvedTasks(codeTasks);
                                    const solvedTestTasks =
                                        countSolvedTasks(testTasks);
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
