import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    className?: string;
    children: React.ReactNode;
}

export default function Container({ className, children }: Props) {
    return (
        <div
            className={cn(
                "max-w-7xl w-full mx-auto max-[1320px]:px-5 pt-4 pb-16",
                className,
            )}
        >
            {children}
        </div>
    );
}
