import React from "react";
import CourseCover from "./icons/CourseCover";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";

interface Props {
    course: Course;
    className?: string;
}

export default function CourseCard({
    course: { imageUrl, id, description, title },
    className,
}: Props) {
    return (
        <div className={cn("flex flex-col gap-4 bg-bg-2 border rounded-md shadow-xs p-4 pb-6", className)}>
            <div className="flex items-center w-full h-40 rounded-sm overflow-hidden">
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
            <h2 className="font-medium text-xl">{title}</h2>
            <p className="text-typography-secondary line-clamp-3">
                {description}
            </p>

            <Button asChild className="group">
                <Link href={`/course/${id}`} className="group gap-0 mt-auto">
                    <span> Изучить</span>
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
        </div>
    );
}
