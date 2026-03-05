"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpenText } from "lucide-react";
import { useCodeEditor } from "@/contexts/useCodeEditor";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import TaskDescription from "./TaskDescription";
import Output from "./Output";

type TabValue = "description" | "output";

interface Props {
    description: string;
    className?: string;
}

export default function TaskInfoTabs({ description, className }: Props) {
    const [tabValue, setTabValue] = useState<TabValue>("description");
    const { output } = useCodeEditor();
    const firstLoaded = useRef(true);
    const pathname = usePathname();

    useEffect(() => {
        firstLoaded.current = true;
    }, [pathname]);

    useEffect(() => {
        if (!firstLoaded.current) {
            setTabValue("output");
        } else {
            firstLoaded.current = false;
        }
    }, [output]);

    return (
        <div
            className={cn(
                "flex flex-col gap-4 max-w-sm w-full h-full",
                className,
            )}
        >
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
            <div
                className={cn(
                    "h-full overflow-hidden",
                )}
            >
                <div className="rounded-md bg-white h-full">
                    {tabValue === "description" && (
                        <TaskDescription description={description} />
                    )}
                    {tabValue === "output" && (
                       <Output />
                    )}
                </div>
            </div>
        </div>
    );
}
