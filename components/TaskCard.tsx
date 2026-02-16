import React from "react";
import DifficultyBadge from "./DifficultyBadge";
import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";

interface Props {
    title: string;
    difficulty: Difficulty;
    isSolved?: boolean;
    className?: string;
}

export default function TaskCard({
    isSolved = false,
    difficulty,
    title,
    className,
}: Props) {
    return (
        <div
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
        </div>
    );
}
