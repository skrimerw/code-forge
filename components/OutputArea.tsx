"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { BookOpenText } from "lucide-react";
import { useCodeEditor } from "@/contexts/useCodeEditor";
import OutputCollapsible from "./OutputCollapsible";
import { usePathname } from "next/navigation";

type TabValue = "description" | "output";

interface Props {
    description: string;
    className?: string;
}

export default function OutputArea({ description, className }: Props) {
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
                    "h-full border-2 rounded-md overflow-hidden transition-colors",
                    output?.code === 1 &&
                        tabValue === "output" &&
                        "border-error",
                )}
            >
                <div className="rounded-md bg-white h-full overflow-y-auto">
                    {tabValue === "description" && (
                        <div className="px-4 py-2 rounded-xl overflow-hidden">
                           {description}
                        </div>
                    )}
                    {tabValue === "output" && (
                        <div>
                            {output === null ? (
                                <p className="px-4 py-2">
                                    Здесь будет показан результат работы вашего
                                    кода
                                </p>
                            ) : (
                                <div className="flex flex-col">
                                    <header className="flex border-b p-4 py-3 text-sm font-medium gap-3">
                                        {output.timedOut ? (
                                            <span className="text-error">
                                                Timed Out
                                            </span>
                                        ) : (
                                            <span>Time: {output.time}ms</span>
                                        )}
                                        <span
                                            className={
                                                output.code === 1
                                                    ? "text-error"
                                                    : "text-easy-foreground"
                                            }
                                        >
                                            Exit code: {output.code}
                                        </span>
                                    </header>
                                    <div className="flex flex-col gap-4 p-4 font-geist-mono">
                                        {output.stdout && (
                                            <OutputCollapsible
                                                title="STDOUT"
                                                content={output.stdout}
                                            />
                                        )}

                                        {output.stderr && (
                                            <OutputCollapsible
                                                title="STDERR"
                                                content={output.stderr}
                                            />
                                        )}

                                        {output.timedOut && (
                                            <div className="font-geist-sans rounded-sm border-2 border-dashed p-2 border-foreground">
                                                <h3 className="text-sm font-semibold mb-1">
                                                    Почему ваш код не успел
                                                    выполниться?
                                                </h3>
                                                <p className="text-xs">
                                                    Наши серверы настроены так,
                                                    чтобы ограничивать время
                                                    выполнения вашего кода. В
                                                    редких случаях сервер может
                                                    быть перегружен задачами и
                                                    не успеть обработать ваш код
                                                    достаточно быстро. Однако
                                                    чаще всего эта проблема
                                                    связана с неэффективными
                                                    алгоритмами. Если вы
                                                    сталкиваетесь с этой ошибкой
                                                    регулярно, рекомендуется
                                                    дополнительно оптимизировать
                                                    код.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
