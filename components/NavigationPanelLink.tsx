"use client";

import { routeMatches } from "@/lib/routeMatches";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
    matcher: string[];
    icon: React.ReactNode;
    label: string;
    url: string;
    className?: string;
}

export default function NavigationPanelLink({
    matcher,
    icon,
    label,
    url,
    className,
}: Props) {
    const pathname = usePathname();

    const isRouteMatching = routeMatches(pathname, matcher);

    return (
        <li
            className={cn(
                "text-[11px] transition-opacity hover:opacity-70",
                className,
            )}
        >
            <Link
                className={cn(
                    "flex flex-col items-center gap-1 transition-colors text-center leading-[110%]",
                    isRouteMatching && "text-purple-800 dark:text-purple-300",
                )}
                href={url}
            >
                <span
                    className={cn(
                        "flex items-center py-0.5 px-1 justify-center rounded-full transition-colors w-11",
                        isRouteMatching &&
                            "bg-purple-600/13 dark:bg-purple-400/20",
                    )}
                >
                    {icon}
                </span>
                {label}
            </Link>
        </li>
    );
}
