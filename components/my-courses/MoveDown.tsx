import React from "react";
import { Button } from "../ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    moveFn: () => void;
    className?: string;
}

export default function MoveDown({ moveFn, className }: Props) {
    return (
        <Button
            variant={"ghost"}
            type="button"
            className={cn(
                "p-0 size-5! duration-[0ms] text-primary/50 dark:text-white/50 rounded-xs",
                className,
            )}
            onClick={moveFn}
        >
            <ArrowDown className="size-4.5!" />
        </Button>
    );
}
