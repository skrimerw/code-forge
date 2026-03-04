"use client";

import CodeEditorProvider from "@/contexts/useCodeEditor";
import { cn } from "@/lib/utils";
import React from "react";
import RunCodeBtn from "./RunCodeBtn";
import LanguageSelector from "./LanguageSelector";
import CodeEditor from "./CodeEditor";
import Output from "./task-info-tabs/Output";

export default function SandboxWrapper() {
    return (
        <CodeEditorProvider>
            <div className={cn("flex gap-4 h-130")}>
                <Output className="max-w-sm w-full h-[calc(100%-56px)] mt-auto border-2 rounded-md overflow-hidden transition-colors bg-white" />

                <div className="flex flex-col gap-4 w-full">
                    {/* Кнопки над редактором кода */}
                    <div className="flex justify-between items-center">
                        <RunCodeBtn />

                        <LanguageSelector />
                    </div>

                    {/* Редактор кода */}
                    <div className="border-2 rounded-md bg-white h-full w-full overflow-hidden">
                        <CodeEditor />
                    </div>
                </div>
            </div>
        </CodeEditorProvider>
    );
}
