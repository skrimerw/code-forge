"use client";

import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/useTheme";

interface Props {
    className?: string;
}

export default function ColorThemeBtn({ className }: Props) {
    const { theme, setTheme } = useTheme();

    function changeTheme() {
        const newTheme = theme === "dark" ? "light" : "dark";

        window.cookieStore.set("theme", newTheme);

        setTheme(newTheme);

        document.body.classList.toggle("dark");
    }

    return (
        <Button
            onClick={changeTheme}
            variant={"ghost"}
            className={cn("group p-0! size-10! w-auto", className)}
            title="Сменить тему"
        >
            <span className="group-hover:rotate-15 transition-transform duration-[350ms]">
                {theme === "light" ? (
                    <Moon strokeWidth={1.7} className="size-7.5" />
                ) : (
                    <Sun strokeWidth={1.7} className="size-7.5" />
                )}
            </span>
        </Button>
    );
}
