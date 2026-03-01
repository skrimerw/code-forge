"use client";

import React from "react";
import { LogOut, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useTopLoader } from "nextjs-toploader";

interface Props {
    session: Session | null;
    className?: string;
}

export default function ProfileBtn({ session, className }: Props) {
    const loader = useTopLoader();

    async function handleClick() {
        loader.start();

        await signOut();
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn("active:scale-100", className)}
                    title={session?.user.name || "Профиль"}
                >
                    {session?.user.image ? (
                        <div className="size-6 rounded-full overflow-hidden">
                            <img src={session?.user.image} alt="avatar" />
                            <div className="relative size-full bg-white/20 animate-pulse">
                                <User className="absolute left-1/2 -translate-x-1/2 -bottom-px text-[#8e9094] fill-[#8e9094]" />
                                <span className="absolute left-1/2 -translate-x-1/2 -bottom-px h-1 w-3 bg-[#8e9094]"></span>
                            </div>
                        </div>
                    ) : (
                        <User />
                    )}
                    <span className="max-w-20 truncate">
                        {session?.user.name || "Профиль"}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                style={{
                    width: "var(--radix-dropdown-menu-trigger-width)",
                }}
            >
                <DropdownMenuItem
                    className="group text-base text-red-500"
                    onClick={handleClick}
                >
                    <LogOut className="size-5! text-red-500" />
                    <span className="group-hover:text-red-500 group-focus-visible:text-red-500">
                        Выйти
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
