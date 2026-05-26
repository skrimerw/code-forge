import Container from "@/components/Container";
import SidebarLink from "@/components/edit-lessons/SidebarLink";
import prisma from "@/prisma/prisma-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
            <aside className="flex-none border-r h-full max-w-[250px] w-full">
                <div className="sticky top-0 max-h-[calc(100dvh)] overflow-auto py-4 pr-4">
                    <h2 className="flex font-bold mb-5">
                        <Link
                            href={`/my-courses/${courseId}/content`}
                            className="hover:underline"
                        >
                            <ArrowLeft
                                size={18}
                                className="float-left mt-1 mr-2"
                            />
                            {modules[0].course.title}
                        </Link>
                    </h2>
                    {modules.map(
                        ({ id, title, themes, order: moduleOrder }) => {
                            return (
                                <div key={id}>
                                    <span className="mr-2 font-mono text-sm">
                                        {moduleOrder}.
                                    </span>
                                    {title}
                                    {themes.map(
                                        ({ id, title, order: themeOrder }) => {
                                            return (
                                                <SidebarLink
                                                    key={id}
                                                    order={`${moduleOrder}.${themeOrder}`}
                                                    label={title}
                                                    url={`/edit-lessons/${courseId}/themes/${id}`}
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            );
                        },
                    )}
                </div>
            </aside>
            <div className="p-5 pl-10 pr-0 w-full">{children}</div>
        </Container>
    );
}
