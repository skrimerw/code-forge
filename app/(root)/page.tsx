import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import prisma from "@/prisma/prisma-client";
import React from "react";

export default async function Home() {
    const courses = await prisma.course.findMany({
        where: {
            status: "PUBLISHED",
        },
        include: {
            ratings: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <Container className="py-8 sm:py-16">
            <div className="max-w-3xl mb-5 sm:mb-10">
                <h1 className="font-semibold text-3xl sm:text-4xl">
                    Новые курсы
                </h1>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {courses.map((course) => {
                    const { id } = course;
                    return (
                        <CourseCard
                            author={course.user}
                            rating={
                                course.ratings.reduce(
                                    (a, b) => a + b.rating,
                                    0,
                                ) / course.ratings.length || 1
                            }
                            key={id}
                            course={course}
                        />
                    );
                })}
            </div>
        </Container>
    );
}
