import { auth } from "@/auth";
import Container from "@/components/Container";
import CacheHandler from "@/components/my-courses/CacheHandler";
import CourseCard from "@/components/my-courses/CourseCard";
import CreateNewCourse from "@/components/my-courses/CreateNewCourse";
import prisma from "@/prisma/prisma-client";
import React from "react";

export default async function MyCoursesPage() {
    const session = await auth();

    const courses = await prisma.course.findMany({
        where: {
            userId: session?.user.id,
        },
    });

    return (
        <Container className="py-8 sm:py-16">
            <CacheHandler />
            {courses.length === 0 ? (
                <div className="flex flex-col items-center max-w-3xl mx-auto">
                    <img
                        className="h-[144px] mb-16 rounded-2xl"
                        src="/img/new-course.png"
                    />
                    <p className="text-xl font-medium mb-5">
                        У вас пока нет курсов, создайте первый
                    </p>
                    <CreateNewCourse />
                </div>
            ) : (
                <div className="max-w-3xl">
                    <div className="flex w-full mb-10 justify-between">
                        <h1 className="font-semibold text-3xl sm:text-4xl">Мои курсы</h1>
                        <CreateNewCourse />
                    </div>
                    <div className="flex flex-col gap-2">
                        {courses.map((course) => {
                            return (
                                <CourseCard key={course.id} course={course} />
                            );
                        })}
                    </div>
                </div>
            )}
        </Container>
    );
}
