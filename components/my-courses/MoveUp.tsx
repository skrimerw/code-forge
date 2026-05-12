import React from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    moveFn: () => void;
    className?: string;
}

export default function MoveUp({ moveFn, className }: Props) {
    return (
        <Button
            variant={"ghost"}
            type="button"
            className={cn(
                "p-0 size-7! duration-[0ms] text-primary/50 dark:text-white/50",
                className,
            )}
            onClick={moveFn}
        >
            <ArrowUp />
        </Button>
    );
}
