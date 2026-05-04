import { cn } from "@/lib/utils";
import { CourseStatus } from "@prisma/client";
import React from "react";

interface Props {
    status: CourseStatus;
    className?: string;
}

export default function Status({ status, className }: Props) {
    const styles = {
        [CourseStatus.IN_PROGRESS]: "bg-primary",
        [CourseStatus.PUBLISHED]: "bg-easy-foreground dark:bg-green-500/30",
    };
    const text = {
        [CourseStatus.IN_PROGRESS]: "В разработке",
        [CourseStatus.PUBLISHED]: "Опубликован",
    };
    return (
        <span
            className={cn(
                "flex items-center text-center text-[13px] h-4.5 w-fit px-2 lowercase rounded-full text-white",
                styles[status],
                className,
            )}
        >
            {text[status]}
        </span>
    );
}
