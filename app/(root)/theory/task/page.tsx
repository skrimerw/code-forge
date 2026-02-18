"use client";

import DifficultyBadge from "@/components/DifficultyBadge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";
import { BookOpenText, ChevronDown, Loader2, Play } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const languages = [
    {
        label: "JavaScript",
        value: "javascript",
    },
    {
        label: "Python",
        value: "python",
    },
];

type TabValue = "description" | "output";

export default function CodeEditorPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("javascript");
    const [tabValue, setTabValue] = useState<TabValue>("description");

    function handleOptionClick(value: string) {
        setIsOpen(false);
        setSelectedValue(value);
    }

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList className="gap-1!">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="text-base">
                                Темы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/theory" className="text-base">
                                Массивы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-base">
                            Поиск наибольшего числа
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="my-10 flex items-center gap-4">
                <DifficultyBadge
                    className="text-base border-2 px-3"
                    difficulty="EASY"
                />
                <h1 className="text-3xl font-semibold">
                    Поиск наибольшего элемента
                </h1>
            </div>
            <div className="flex gap-4 h-130">
                <div className="flex flex-col gap-4 max-w-xs w-full h-full">
                    {/* Кнопки над областью вывода */}
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            <Button
                                onClick={() => setTabValue("description")}
                                variant={"ghost"}
                                className={cn(
                                    "text-foreground  h-10",
                                    tabValue === "description" &&
                                        "bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-[#f8f8f8]",
                                )}
                            >
                                Описание
                            </Button>
                            <Button
                                onClick={() => setTabValue("output")}
                                variant={"ghost"}
                                className={cn(
                                    "h-10",
                                    tabValue === "output" &&
                                        "bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-[#f8f8f8]",
                                )}
                            >
                                Вывод
                            </Button>
                        </div>
                        <Button
                            variant={"secondary"}
                            className="text-foreground bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-[#f8f8f8] p-2.5 flex items-center justify-center"
                        >
                            <BookOpenText />
                        </Button>
                    </div>

                    {/* Область вывода */}
                    <div className="border rounded-md p-4 bg-white h-full">
                        {tabValue === "description" && (
                            <div>
                                Напишите программу, которая ищет наибольшее
                                элемент в массиве. На вход поступают массивы с
                                числовым типом.
                            </div>
                        )}
                        {tabValue === "output" && (
                            <div className="font-geist-mono">// Output</div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {/* Кнопки над редактором кода */}
                    <div className="flex justify-between items-center">
                        <Button className="h-10 bg-easy-foreground hover:bg-easy-foreground/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
                            <Play />
                            Запустить
                        </Button>

                        <DropdownMenu modal={false} open={isOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="w-40 h-10 justify-between"
                                    variant={"outline"}
                                    onClick={() => setIsOpen((prev) => !prev)}
                                >
                                    {
                                        languages.filter(
                                            (lang) =>
                                                lang.value === selectedValue,
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
                                                onClick={() =>
                                                    handleOptionClick(
                                                        lang.value,
                                                    )
                                                }
                                                className="w-full"
                                            >
                                                {lang.label}
                                            </button>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Редактор кода */}
                    <div className="border rounded-md bg-white h-full w-full overflow-hidden">
                        <Editor
                            language={selectedValue}
                            loading={
                                <div className="flex flex-col gap-2.5 items-center">
                                    <Loader2
                                        size={40}
                                        className="animate-spin text-foreground"
                                    />
                                    <p>Загружаем Monaco Editor</p>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
