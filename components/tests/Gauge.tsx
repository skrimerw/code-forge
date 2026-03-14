import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    percentage: number;
    className?: string;
}

export default function Gauge({ percentage, className }: Props) {
    function getColorClass() {
        if (percentage > 66) {
            return "stroke-easy-foreground";
        } else if (percentage > 33) {
            return "stroke-medium-foreground";
        } else {
            return "stroke-hard-foreground";
        }
    }

    return (
        <svg viewBox="0 0 200 120" className={cn("w-10", className)}>
            <path
                d="M20 100 A80 80 0 0 1 180 100"
                className="fill-none stroke-secondary stroke-[40px]"
                strokeLinecap="round"
            />

            <path
                d="M20 100 A80 80 0 0 1 180 100"
                className={cn(`fill-none stroke-[40px] ${getColorClass()}`)}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${percentage} 100`}
            />
        </svg>
    );
}
