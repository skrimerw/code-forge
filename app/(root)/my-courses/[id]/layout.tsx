import Container from "@/components/Container";
import CourseCover from "@/components/icons/CourseCover";
import Sidebar from "@/components/my-courses/Sidebar";
import SidebarLink from "@/components/my-courses/SidebarLink";
import Status from "@/components/my-courses/Status";
import { CourseDataProvider } from "@/contexts/useCourseData";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React from "react";

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    const course = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (!course) {
        notFound();
    }

    return (
        <Container className="p-0 h-full">
            <CourseDataProvider initialData={course}>
                <div className="flex h-full">
                    <Sidebar className="mr-auto w-full ml-0" />

                    <div className="p-5 pl-10 pr-0 w-full">{children}</div>
                </div>
            </CourseDataProvider>
        </Container>
    );
}
