import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import prisma from "@/prisma/prisma-client";
import React from "react";

export default async function Home() {
    const courses = await prisma.course.findMany({
        where: {
            status: "PUBLISHED",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <Container className="py-16">
            <div className="max-w-3xl mb-10">
                <h1 className="font-semibold text-4xl">Последние курсы</h1>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {courses.map((course) => {
                    const { id } = course;
                    return <CourseCard key={id} course={course} />;
                })}
            </div>
        </Container>
    );
}
