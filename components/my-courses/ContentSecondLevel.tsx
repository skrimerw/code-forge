import { cn } from "@/lib/utils";
import { Theme } from "@prisma/client";
import { Edit } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import CourseCover from "../icons/CourseCover";

interface Props {
    courseId: number;
    moduleOrder: number;
    theme: Theme;
    className?: string;
}

export default function ContentSecondLevel({
    courseId,
    moduleOrder,
    theme: { id, imageUrl, order: themeOrder, title },
    className,
}: Props) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 sm:gap-6 py-3.5 px-3 sm:px-5 bg-bg-2",
                className,
            )}
        >
            <div className="flex flex-none items-center size-10 rounded-sm overflow-hidden object-cover">
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
            <h3 className="text-base">
                <span className="text-sm text-primary/50 dark:text-white/50 font-mono mr-2">
                    {moduleOrder}.{themeOrder}
                </span>
                {title}
            </h3>
            <Button
                className="ml-auto size-8 sm:size-10"
                variant={"ghost"}
                title="Редактировать"
                asChild
            >
                <Link href={`/edit-lessons/${courseId}/themes/${id}`}>
                    <Edit />
                </Link>
            </Button>
        </div>
    );
}
