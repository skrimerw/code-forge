"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
    order: string;
    url: string;
    label: string;
    className?: string;
}

export default function SidebarLink({ order, label, url, className }: Props) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "ml-5",
                pathname.includes(url) && "text-blue-500",
                className,
            )}
        >
            <Link href={url}>
                <span className="font-mono mr-2 text-sm">{order}</span>
                {label}
            </Link>
        </div>
    );
}
