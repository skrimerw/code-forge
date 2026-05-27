"use client";

import { routeMatches } from "@/lib/routeMatches";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
    matcher: string[];
    url: string;
    label: string;
    className?: string;
}

export default function SidebarLink({ matcher, url, label, className }: Props) {
    const pathname = usePathname();

    const isRouteMatching = routeMatches(pathname, matcher);

    return (
        <Link
            href={url}
            className={cn(
                "rounded-sm p-2 px-4 -ml-3 hover:bg-blue-500/10",
                className,
                isRouteMatching && "text-blue-500",
            )}
        >
            {label}
        </Link>
    );
}
