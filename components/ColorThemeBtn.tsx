import React from "react";
import { Button } from "./ui/button";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export default function ColorThemeBtn({ className }: Props) {
    return (
        <Button
            variant={"ghost"}
            className={cn("p-0! size-10! w-auto", className)}
        >
            <Moon strokeWidth={1.7} className="size-7.5" />
        </Button>
    );
}
