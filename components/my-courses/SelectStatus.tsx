"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { CourseStatus } from "@prisma/client";
import { Button } from "../ui/button";

type Filters = "ALL" | CourseStatus;

interface Props {
    initialStatus: Filters;
    className?: string;
}

export default function SelectStatus({ initialStatus, className }: Props) {
    const [status, setStatus] = useState(initialStatus);
    const [isOpen, setIsOpen] = useState(false);

    function handleOptionClick(status: Filters) {
        setIsOpen(false);
        setStatus(status);
    }

    useEffect(() => {
        function handleClick(e: PointerEvent) {
            const target = e.target as Element;

            if (!target.closest(".language-selector") && isOpen) {
                setIsOpen(false);
            }
        }

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isOpen]);

    return (
        <DropdownMenu modal={false} open={isOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn(
                        "relative w-40 h-10 justify-between",
                        className,
                    )}
                    variant={"outline"}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {status}
                    <ChevronDown
                        className={cn(
                            "transition-transform duration-300 ml-auto",
                            isOpen && "rotate-180",
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="language-selector"
                style={{
                    width: "var(--radix-dropdown-menu-trigger-width)",
                }}
            >
                {["ALL", ...Object.keys(CourseStatus)].map((courseStatus) => {
                    return (
                        <DropdownMenuItem
                            key={courseStatus}
                            className="text-base text-foreground"
                            asChild
                        >
                            <button
                                onClick={() =>
                                    handleOptionClick(courseStatus as Filters)
                                }
                                className="w-full"
                            >
                                {courseStatus}
                            </button>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
