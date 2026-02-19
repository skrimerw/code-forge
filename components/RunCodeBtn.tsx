"use client";

import React from "react";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCodeEditor } from "@/contexts/useCodeEditor";

interface Props {
    className?: string;
}

export default function RunCodeBtn({ className }: Props) {
    const { editorRef } = useCodeEditor();

    function handleRunClick() {
        if (editorRef.current) {
            const code = editorRef.current.getValue();

            
        }
    }

    return (
        <Button
            className={cn(
                "h-10 bg-easy-foreground text-white hover:bg-easy-foreground/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]",
                className,
            )}
            onClick={handleRunClick}
        >
            <Play />
            Запустить
        </Button>
    );
}
