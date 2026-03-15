"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
    className?: string;
}

export default function Logo({ className }: Props) {
    const siteName = "CodeForge";

    const [count, setCount] = useState(0);

    useEffect(() => {
        const intervalTyping = setInterval(() => {
            if (count <= siteName.length) {
                setCount((prev) => prev + 1);
            } 
        }, 60);

        return () => {
            clearInterval(intervalTyping);
        };
    }, []);

    return (
        <div className={cn("flex items-center gap-4", className)}>
            <img src="/img/logo.svg" alt="Logo" className="rounded-sm transition-shadow dark:shadow-[0_0_12px_5px_rgb(108,75,253,0.2)]" />
            <h3 className="text-xl font-[630] font-geist-mono">
                {siteName.slice(0, count)}
                <span className={cn("tracking-[-9px]", count >= siteName.length && "animate-pulse animation-duration-[1300ms]")}>__</span>
            </h3>
        </div>
    );
}
