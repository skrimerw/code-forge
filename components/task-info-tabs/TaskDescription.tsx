import { cn } from "@/lib/utils";
import React from "react";
import { defineScript } from "redis";

interface Props {
    description: string;
    className?: string;
}

export default function TaskDescription({ description, className }: Props) {
    return (
        <div className={cn("px-4 py-2 rounded-xl overflow-hidden", className)}>
            <p>{description}</p>
        </div>
    );
}
