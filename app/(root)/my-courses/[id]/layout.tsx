import Container from "@/components/Container";
import Sidebar from "@/components/my-courses/Sidebar";
import { CourseDataProvider } from "@/contexts/useCourseData";
import { SidebarProvider } from "@/contexts/useMyCoursesSidebar";
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
    const id = Number((await params).id);

    if (isNaN(id)) {
        notFound();
    }

    const course = await prisma.course.findFirst({
        where: {
            id: id,
        },
    });

    if (!course) {
        notFound();
    }

    return (
        <Container className="p-0 h-full">
            <CourseDataProvider initialData={course}>
                <div className="flex h-full">
                    <Sidebar className="hidden lg:block mr-auto w-full ml-0" />

                    <div className="p-5 pb-24 sm:pb-5 px-3 sm:px-0 lg:pl-10 w-full">
                        <SidebarProvider>{children}</SidebarProvider>
                    </div>
                </div>
            </CourseDataProvider>
        </Container>
    );
}
