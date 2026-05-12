"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
    url: string;
    label: string;
    className?: string;
}

export default function SidebarLink({ url, label, className }: Props) {
    const pathname = usePathname();

    return (
        <Link
            href={url}
            className={cn("rounded-sm p-2 px-4 -ml-3 hover:bg-blue-500/10", className, pathname === url && "text-blue-500")}
        >
            {label}
        </Link>
    );
}
