import { auth } from "@/auth";
import Container from "@/components/Container";
import CourseRating from "@/components/CourseRating";
import ThemeCard from "@/components/ThemeCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RatingProvider } from "@/contexts/useRating";
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

    if (isNaN(id)) {
        notFound();
    }

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

    const course = modules[0].course;

    const { _avg: avgRating, _count: reviewsCount } =
        await prisma.rating.aggregate({
            _avg: {
                rating: true,
            },
            _count: true,
            where: {
                courseId: course.id,
            },
        });

    const userRating = await prisma.rating.findFirst({
        where: {
            courseId: course.id,
            userId: session?.user.id,
        },
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
                        <BreadcrumbPage className="text-base">
                            {course.title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div
                className={`flex flex-col sm:flex-row justify-between gap-2.5 sm:gap-5 lg:gap-10 mt-10 md:my-10`}
            >
                <div className="flex gap-3 md:gap-5">
                    <div className="flex-none size-22 md:size-24 lg:size-32 rounded-md overflow-hidden shadow-md">
                        <img
                            src={course.imageUrl || ""}
                            className="object-cover size-full"
                        />
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="font-semibold text-xl md:text-3xl lg:text-4xl mb-2">
                            {course.title}
                        </h1>
                        <p className="hidden md:block text-typography-secondary">
                            {course.description}
                        </p>
                    </div>
                </div>
                <RatingProvider
                    initialRating={{
                        rating: avgRating.rating || 0,
                        reviewsCount,
                    }}
                >
                    <CourseRating
                        className="w-full items-center sm:items-end sm:w-[215px]"
                        userRating={userRating?.rating || 0}
                        courseId={course.id}
                    />
                </RatingProvider>
            </div>

            <div className="mb-5">
                <h2 className="font-semibold text-xl">О чем курс</h2>
                <p className="block md:hidden text-typography-secondary text-[15px] md:text-base">
                    {course.description}
                </p>
            </div>

            <div className="flex flex-col gap-16">
                {modules.map(({ id, themes, title }) => {
                    return (
                        <section key={id}>
                            <h2 className="mb-2.5 md:mb-5 text-lg md:text-2xl font-medium md:font-semibold">
                                {title}
                            </h2>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
