import SidebarLink from "@/components/my-courses/SidebarLink";
import Status from "@/components/my-courses/Status";
import prisma from "@/prisma/prisma-client";
import Link from "next/link";
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

    console.log((await params).id);
    return (
        <div className="flex h-full">
            <aside className="flex flex-col border-r min-w-[250px] p-5 pr-10 h-full">
                <div className="ml-auto">
                    <div className="size-16 rounded-md overflow-hidden object-cover">
                        <img
                            src={
                                course.imageUrl ||
                                "https://stepik.org/static/frontend/course_cover.png"
                            }
                            className="size-full"
                        />
                    </div>
                    <h2 className="font-semibold mt-5">{course.title}</h2>
                    <Status status={course.status} className="mt-1" />
                    <ul className="flex flex-col mt-10">
                        <li>
                            <SidebarLink
                                label="Описание"
                                url={`/my-courses/${id}`}
                            />
                        </li>
                        <li>
                            <SidebarLink
                                label="Содержание"
                                url={`/my-courses/${id}/content`}
                            />
                        </li>
                        <li>
                            <SidebarLink
                                label="Чек-лист"
                                url={`/my-courses/${id}/check-list`}
                            />
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="p-5 pl-10 w-full max-w-3xl">{children}</div>
        </div>
    );
}
