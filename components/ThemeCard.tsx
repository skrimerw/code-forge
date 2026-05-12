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
                "flex flex-col gap-4 w-full basis-1/3 bg-bg-2 p-4 pb-6 rounded-md shadow-[0_0_4px_0_rgba(0,0,0,0.1)]",
                className,
            )}
        >
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
            <h3 className="font-medium text-xl">{title}</h3>
            <div>
                <ProgressBar progress={progress} />
                <p className="text-typography-secondary">{description}</p>
            </div>
            <Button asChild>
                <Link href={`/theme/${slug}`} className="group gap-0 mt-auto">
                    <span>Перейти</span>
                    <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </Button>
        </div>
    );
}
