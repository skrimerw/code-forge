import Container from "@/components/Container";
import Sidebar from "@/components/edit-lessons/Sidebar";
import { LessonsSidebarProvider } from "@/contexts/useLessonsSidebar";
import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

export default async function Layout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ course_id: string }>;
}) {
    const courseId = Number((await params).course_id);
    const modules = await prisma.module.findMany({
        where: {
            courseId,
        },
        include: {
            course: true,
            themes: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    if (!modules) {
        notFound();
    }

    return (
        <Container className="flex py-0 h-full">
            <Sidebar
                className="hidden lg:block"
                modules={modules}
                courseId={courseId}
            />
            <div className="p-5 pb-24 sm:pb-5 px-0 lg:pl-10 w-full">
                <LessonsSidebarProvider modules={modules} courseId={courseId}>
                    {children}
                </LessonsSidebarProvider>
            </div>
        </Container>
    );
}
