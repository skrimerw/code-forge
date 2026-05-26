import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    className?: string;
}

export default function Footer({ className }: Props) {
    return (
        <footer
            className={cn(
                "bg-primary dark:bg-bg-2 text-center py-2.5 text-white font-medium text-sm h-fit",
                className,
            )}
        >
            Made by{" "}
            <a
                className="text-[#A0A0A0] underline underline-offset-1 transition-colors hover:text-white/70"
                href="https://github.com/skrimerw"
                target="_blank"
                rel="nofollow"
            >
                @skrimerw
            </a>
        </footer>
    );
}
