"use client";

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { ChartColumnBigIcon, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { signOut } from "next-auth/react";
import ColorThemeBtn from "./ColorThemeBtn";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/useTheme";

export default function SettingsBtn() {
    const loader = useTopLoader();
    const { theme, setTheme } = useTheme();

    async function handleClick() {
        loader.start();

        await signOut();
    }

    function changeTheme() {
        const newTheme = theme === "dark" ? "light" : "dark";

        window.cookieStore.set("theme", newTheme);

        setTheme(newTheme);

        document.body.classList.toggle("dark");
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <div className="flex flex-col gap-1 text-center items-center cursor-pointer">
                    <Settings size={22} />
                    Настройки
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={15}>
                <DropdownMenuItem>
                    <Button
                        onClick={changeTheme}
                        variant={"ghost"}
                        className="group p-0! w-auto text-sm text-foreground hover:bg-transparent"
                        title="Смена темы"
                    >
                        <span className="group-hover:rotate-15 transition-transform duration-[350ms]">
                            {theme === "light" ? (
                                <Moon
                                    strokeWidth={1.7}
                                    className="size-5 text-foreground"
                                />
                            ) : (
                                <Sun
                                    strokeWidth={1.7}
                                    className="size-5 text-foreground"
                                />
                            )}
                        </span>
                        {theme === "dark" ? "Темная тема" : "Светлая тема"}
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/stats"}>
                        <ChartColumnBigIcon className="size-5! text-foreground" />
                        Прогресс
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="group text-red-500"
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
