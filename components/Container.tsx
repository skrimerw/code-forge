import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    className?: string;
    children: React.ReactNode
}

export default function Container({ className, children }: Props) {
    return (
        <div className={cn("max-w-7xl w-full mx-auto", className)}>
            {children}
        </div>
    );
}
