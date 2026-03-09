"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useCodeEditor } from "@/contexts/useCodeEditor";
import { Language } from "@prisma/client";
import { LangObj } from "@/types";

interface Props {
    availableLangs: LangObj[];
    className?: string;
}

export default function LanguageSelector({ availableLangs, className }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasLangLoaded, setHasLangLoaded] = useState(false);
    const { lang: selectedLanguage, setLang } = useCodeEditor();

    function handleOptionClick(value: Language) {
        setIsOpen(false);
        setLang(value);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setHasLangLoaded(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <DropdownMenu modal={false} open={isOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn(
                        "relative w-40 h-10 justify-between",
                        className,
                    )}
                    variant={"outline"}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {hasLangLoaded ? (
                        availableLangs.filter(
                            (lang) => lang.value === selectedLanguage,
                        )[0].label
                    ) : (
                        <div
                            className={cn(
                                "absolute left-3 rounded-full bg-secondary animate-pulse h-5 w-[100px] transition-[visibility] visible",
                                hasLangLoaded && "invisible",
                            )}
                        ></div>
                    )}
                    <ChevronDown
                        className={cn(
                            "transition-transform duration-300 ml-auto",
                            isOpen && "rotate-180",
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                style={{
                    width: "var(--radix-dropdown-menu-trigger-width)",
                }}
            >
                {availableLangs.map((lang) => {
                    return (
                        <DropdownMenuItem
                            key={lang.value}
                            className="text-base text-foreground"
                            asChild
                        >
                            <button
                                onClick={() => handleOptionClick(lang.value)}
                                className="w-full"
                            >
                                {lang.label}
                            </button>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
