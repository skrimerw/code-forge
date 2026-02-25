import React from "react";
import DifficultyBadge from "./DifficultyBadge";
import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Props {
    url: string;
    title: string;
    difficulty: Difficulty;
    isSolved?: boolean;
    className?: string;
}

export default function TaskCard({
    isSolved = false,
    url,
    difficulty,
    title,
    className,
}: Props) {
    return (
        <Link
        href={url}
            className={cn(
                "flex items-center justify-between rounded-lg bg-white p-4 pl-6 cursor-pointer transition-all duration-300 hover:scale-101 hover:shadow",
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <h4>{title}</h4>
                {isSolved && <CheckCircle2 className="text-easy-foreground" />}
            </div>
            <DifficultyBadge difficulty={difficulty} />
        </Link>
    );
}
