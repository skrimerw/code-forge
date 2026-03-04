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
    content: string;
    className?: string;
}

export default function OutputCollapsible({
    content,
    title,
    className,
}: Props) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Collapsible
            open={isOpen}
            className={cn("border rounded-sm", className)}
        >
            <CollapsibleTrigger
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "flex items-center gap-1 text-xs font-bold p-2 w-full text-start",
                    isOpen && "border-b",
                )}
            >
                <ChevronRight
                    size={14}
                    className={cn(
                        "transition-transform",
                        isOpen && "rotate-90",
                    )}
                />
                {title}
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-x-auto">
                <pre className="p-2 text-sm">{content}</pre>
            </CollapsibleContent>
        </Collapsible>
    );
}
