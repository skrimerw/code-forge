import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

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
            <div className="aspect-2/1 rounded-md overflow-hidden">
                <img
                    className="object-cover size-full"
                    src={imageUrl}
                    alt="Preview"
                />
            </div>
            <h3 className="font-medium text-xl">{title}</h3>
            <div>
                <ProgressBar progress={progress} />
                <p className="text-typography-secondary">{description}</p>
            </div>
            <Button asChild>
                <Link href={`/theme/${slug}`} className="group gap-0">
                    <span>Перейти</span>
                    <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </Button>
        </div>
    );
}
