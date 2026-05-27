"use client";

import React from "react";
import Status from "./Status";
import SidebarLink from "./SidebarLink";
import CourseCover from "../icons/CourseCover";
import { useCourseData } from "@/contexts/useCourseData";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import Unpublish from "./Unpublish";

interface Props {
    className?: string;
}

export default function Sidebar({ className }: Props) {
    const {
        course: { id, imageUrl, status, title },
    } = useCourseData();

    return (
        <aside
            className={cn(
                "flex flex-col border-r pr-4 py-4 h-full max-w-[250px] w-full",
                className,
            )}
        >
            <div className="sticky top-5">
                <div className="flex items-center size-16 rounded-md overflow-hidden object-cover">
                    {imageUrl ? (
                        <img
                            className="object-cover size-full"
                            src={imageUrl}
                            alt="Preview"
                        />
                    ) : (
                        <CourseCover />
                    )}
                </div>
                <h2 className="font-semibold mt-5">{title}</h2>
                <Status status={status} className="mt-1" />
                {status === "PUBLISHED" && <Unpublish />}
                {status === "IN_PROGRESS" && (
                    <Button
                        asChild
                        variant={"outline"}
                        className="py-0 h-9 mt-4 border-blue-500 text-blue-500 bg-transparent hover:text-blue-700 hover:border-blue-700"
                    >
                        <Link href={`/my-courses/${id}/check-list`}>
                            Опубликовать
                        </Link>
                    </Button>
                )}
                <ul className="flex flex-col mt-4">
                    <li className="w-full">
                        <SidebarLink
                            matcher={["/my-courses/[id]/description"]}
                            className="w-full! active:w-full block"
                            label="Описание"
                            url={`/my-courses/${id}/description`}
                        />
                    </li>
                    <li className="w-full">
                        <SidebarLink
                            matcher={[
                                "/my-courses/[id]/content",
                                "/my-courses/[id]/edit-content",
                            ]}
                            className="w-full! active:w-full block"
                            label="Содержание"
                            url={`/my-courses/${id}/content`}
                        />
                    </li>
                    <li className="w-full">
                        <SidebarLink
                            matcher={["/my-courses/[id]/check-list"]}
                            label="Чек-лист"
                            className="w-full! active:w-full block"
                            url={`/my-courses/${id}/check-list`}
                        />
                    </li>
                </ul>
            </div>
        </aside>
    );
}
