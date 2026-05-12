"use client";

import React from "react";
import Status from "./Status";
import SidebarLink from "./SidebarLink";
import CourseCover from "../icons/CourseCover";
import { useCourseData } from "@/contexts/useCourseData";
import { cn } from "@/lib/utils";

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
                <ul className="flex flex-col mt-10">
                    <li className="w-full">
                        <SidebarLink
                            className="w-full! active:w-full block"
                            label="Описание"
                            url={`/my-courses/${id}`}
                        />
                    </li>
                    <li className="w-full">
                        <SidebarLink
                            className="w-full! active:w-full block"
                            label="Содержание"
                            url={`/my-courses/${id}/content`}
                        />
                    </li>
                    <li className="w-full">
                        <SidebarLink
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
