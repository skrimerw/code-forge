"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useCodeEditor } from "@/contexts/useCodeEditor";

type LangObj = {
    label: string;
    value: Language;
};

const languages: LangObj[] = [
    {
        label: "JavaScript",
        value: "javascript",
    },
    {
        label: "Python",
        value: "python",
    },
];

interface Props {
    className?: string;
}

export default function LanguageSelector({ className }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { lang: selectedLanguage, setLang } = useCodeEditor();

    function handleOptionClick(value: Language) {
        setIsOpen(false);
        setLang(value);
    }

    return (
        <DropdownMenu modal={false} open={isOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    className={cn("w-40 h-10 justify-between", className)}
                    variant={"outline"}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {
                        languages.filter(
                            (lang) => lang.value === selectedLanguage,
                        )[0].label
                    }
                    <ChevronDown
                        className={cn(
                            "transition-transform duration-300",
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
                {languages.map((lang) => {
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
