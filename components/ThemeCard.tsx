import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import CourseCover from "./icons/CourseCover";

interface Props {
    slug: string;
    title: string;
    description: string;
    progress: number;
    imageUrl: string;
    className?: string;
}

export default function ThemeCard({
    slug,
    description,
    imageUrl,
    progress,
    title,
    className,
}: Props) {
    return (
        <div
            className={cn(
                "relative flex flex-col gap-2.5 sm:gap-4 w-full basis-1/3 bg-bg-2 p-3 sm:p-4 sm:pb-6 rounded-md shadow-sm hover:shadow-md transition-shadow",
                className,
            )}
        >
            <Link href={`/theme/${slug}`} className="absolute inset-0" />
            <div className="flex items-center aspect-2/1 rounded-md overflow-hidden">
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
            <Link
                href={`/theme/${slug}`}
                className="relative z-1 hover:underline w-fit"
            >
                <h3 className="font-medium text-xl">{title}</h3>
            </Link>
            <div>
                <ProgressBar progress={progress} />
                <p className="text-typography-secondary text-[15px] sm:text-base">
                    {description}
                </p>
            </div>
            <Button asChild>
                <Link
                    href={`/theme/${slug}`}
                    className="relative z-1 group h-9 sm:h-10 gap-0 mt-auto"
                >
                    <span>Перейти</span>
                    <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </Button>
        </div>
    );
}
