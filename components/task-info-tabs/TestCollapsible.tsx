"use client";

import React, { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Props {
    title: string;
    children: React.ReactNode;
    isPassed: boolean;
    className?: string;
}

export default function TestCollapsible({
    children,
    title,
    isPassed,
    className,
}: Props) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible
            open={isOpen}
            className={cn(className)}
        >
            <CollapsibleTrigger
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "flex items-center gap-1 font-medium py-2 text-start",
                    !isOpen && (isPassed ? "text-easy-foreground" : "text-error")
                )}
            >
                <ChevronRight
                    size={14}
                    strokeWidth={3.5}
                    className={cn(
                        "transition-transform",
                        isOpen && "rotate-90",
                        isPassed ? "text-easy-foreground" : "text-error"
                    )}
                />
                {title}
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-x-auto pl-5">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}
