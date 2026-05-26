import React from "react";
import CourseCover from "./icons/CourseCover";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronRight, Dot, Star } from "lucide-react";
import { Course, User } from "@prisma/client";
import { cn } from "@/lib/utils";

interface Props {
    author: User;
    rating: number;
    course: Course;
    className?: string;
}

export default function CourseCard({
    author: { email },
    rating,
    course: { imageUrl, id, title },
    className,
}: Props) {
    const formattedRating = rating.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
    return (
        <div
            className={cn(
                "relative flex flex-col gap-8 bg-bg-2 border rounded-md shadow-xs p-3 sm:p-4 hover:shadow-md transition-shadow",
                className,
            )}
        >
            <Link href={`/course/${id}`} className="absolute inset-0 z-0" />

            <div className="flex gap-4 w-full justify-between">
                <div>
                    <Link
                        href={`/course/${id}`}
                        className="relative z-1 cursor-pointer font-medium line-clamp-2 leading-[110%] hover:underline"
                        title={title}
                    >
                        {title}
                    </Link>
                    <div className="flex items-center gap-1 mt-2 text-typography-secondary text-sm">
                        <span className="flex items-center gap-0.5 text-xs">
                            <Star
                                strokeWidth={0}
                                size={16}
                                className="fill-typography-secondary"
                            />
                            {formattedRating}
                        </span>
                        <Dot size={8} strokeWidth={8} />
                        {email}
                    </div>
                </div>
                <div className="flex flex-none items-center size-16 rounded-sm overflow-hidden">
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
            </div>

            <Button asChild className="relative z-1 group h-9">
                <Link href={`/course/${id}`} className="group gap-0 mt-auto">
                    <span>Изучить</span>
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
        </div>
    );
}
