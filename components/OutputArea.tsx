"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { BookOpenText } from "lucide-react";

type TabValue = "description" | "output";

interface Props {
    className?: string
}

export default function OutputArea({className}: Props) {
    const [tabValue, setTabValue] = useState<TabValue>("description");

    return (
        <div className={cn("flex flex-col gap-4 max-w-xs w-full h-full", className)}>
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
                        Напишите программу, которая ищет наибольшее элемент в
                        массиве. На вход поступают массивы с числовым типом.
                    </div>
                )}
                {tabValue === "output" && (
                    <div className="font-geist-mono">// Output</div>
                )}
            </div>
        </div>
    );
}
