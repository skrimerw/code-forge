"use client";

import React from "react";
import { Button } from "../ui/button";
import { SidebarOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLessonsSidebar } from "@/contexts/useLessonsSidebar";

interface Props {
    className?: string;
}

export default function OpenSheet({ className }: Props) {
    const { setOpen } = useLessonsSidebar();

    return (
        <Button
            onClick={() => setOpen(true)}
            className={cn("lg:hidden bg-bg-2! border p-0 size-8 h-11 hover:bg-bg-2/50 shadow-xs text-foreground!", className)}
        >
            <SidebarOpen />
        </Button>
    );
}
