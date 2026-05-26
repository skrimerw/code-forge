import React from "react";
import DifficultyBadge from "./DifficultyBadge";
import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { SuccessRate } from "@/lib/queries/success-rate-code-tasks";

interface Props {
    url: string;
    title: string;
    difficulty: Difficulty;
    isSolved?: boolean;
    successRate: SuccessRate;
    className?: string;
}

export default function TaskCard({
    isSolved = false,
    url,
    difficulty,
    title,
    successRate,
    className,
}: Props) {
    const successPercent = (successRate.success_rate * 100).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 2,
        },
    );

    return (
        <Link
            href={url}
            className={cn(
                "flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between rounded-lg bg-bg-2 p-3 sm:p-4 sm:pl-6 cursor-pointer transition-all duration-300 hover:shadow",
                className,
            )}
        >
            <div className="flex items-center gap-3 mr-5">
                <h4 className="w-fit text-start inline">{title}</h4>
                {isSolved && <CheckCircle2 className="text-easy-foreground" />}
            </div>
            <div className="flex">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="ml-auto mr-4 flex items-center text-sm gap-1 font-medium">
                            <Target
                                className="text-foreground"
                                size={18}
                                strokeWidth={1.5}
                            />
                            {successPercent}%{" "}
                            <span className="font-normal">из</span>{" "}
                            {successRate.total_solutions}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-fit max-w-[250px] text-center">
                        {successPercent}% пользователей из{" "}
                        {successRate.total_solutions}, взявших это задание,
                        успешно решили его.
                    </TooltipContent>
                </Tooltip>
                <DifficultyBadge
                    className="flex-none"
                    difficulty={difficulty}
                />
            </div>
        </Link>
    );
}
