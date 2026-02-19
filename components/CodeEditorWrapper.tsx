"use client";

import CodeEditorProvider from "@/contexts/useCodeEditor";
import React from "react";
import OutputArea from "./OutputArea";
import { cn } from "@/lib/utils";
import LanguageSelector from "./LanguageSelector";
import CodeEditor from "./CodeEditor";
import RunCodeBtn from "./RunCodeBtn";

interface Props {
    className?: string;
}

export default function CodeEditorWrapper({ className }: Props) {
    return (
        <CodeEditorProvider>
            <div className={cn("flex gap-4 h-130", className)}>
                <OutputArea />

                <div className="flex flex-col gap-4 w-full">
                    {/* Кнопки над редактором кода */}
                    <div className="flex justify-between items-center">
                        <RunCodeBtn />

                        <LanguageSelector />
                    </div>

                    {/* Редактор кода */}
                    <div className="border rounded-md bg-white h-full w-full overflow-hidden">
                        <CodeEditor />
                    </div>
                </div>
            </div>
        </CodeEditorProvider>
    );
}
