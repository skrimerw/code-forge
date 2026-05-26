import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    description: string;
    className?: string;
}

export default function TaskDescription({ description, className }: Props) {
    return (
        <div className={cn("px-4 py-2 overflow-hidden border-2 h-full rounded-md overflow-y-auto", className)}>
            <p>{description}</p>
        </div>
    );
}
