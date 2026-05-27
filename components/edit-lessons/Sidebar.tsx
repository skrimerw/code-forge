import React from "react";
import SidebarLink from "./SidebarLink";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Link from "next/link";

interface Props {
    courseId: number;
    modules: Prisma.ModuleGetPayload<{
        include: { course: true; themes: true };
    }>[];
    className?: string;
}

export default function Sidebar({ courseId, modules, className }: Props) {
    return (
        <aside
            className={cn(
                "flex-none border-r h-full max-w-[250px] w-full",
                className,
            )}
        >
            <div className="sticky top-0 max-h-[calc(100dvh)] overflow-auto py-4 pr-4">
                <h2 className="flex font-bold mb-5">
                    <Link
                        href={`/my-courses/${courseId}/content`}
                        className="hover:underline"
                    >
                        <ArrowLeft size={18} className="float-left mt-1 mr-2" />
                        {modules[0].course.title}
                    </Link>
                </h2>
                {modules.map(({ id, title, themes, order: moduleOrder }) => {
                    return (
                        <div key={id}>
                            <span className="mr-2 font-mono text-sm">
                                {moduleOrder}.
                            </span>
                            {title}
                            {themes.map(({ id, title, order: themeOrder }) => {
                                return (
                                    <SidebarLink
                                        key={id}
                                        order={`${moduleOrder}.${themeOrder}`}
                                        label={title}
                                        url={`/edit-lessons/${courseId}/themes/${id}`}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
