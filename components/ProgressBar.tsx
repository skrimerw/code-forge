import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    progress: number;
    className?: string;
}

export default function ProgressBar({ progress, className }: Props) {
    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <div className="relative rounded-full w-full h-2.5 bg-secondary overflow-hidden">
                <span
                    className="absolute top-0 left-0 inline-block h-full bg-easy-foreground rounded-full"
                    style={{
                        width: `${progress}%`,
                    }}
                ></span>
            </div>
            <span>
                {progress.toLocaleString("ru-RU", {
                    maximumFractionDigits: 2,
                })}
                %
            </span>
        </div>
    );
}
