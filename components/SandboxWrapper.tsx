"use client";

import CodeEditorProvider from "@/contexts/useCodeEditor";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import RunCodeBtn from "./RunCodeBtn";
import LanguageSelector from "./LanguageSelector";
import CodeEditor from "./CodeEditor";
import Output from "./task-info-tabs/Output";
import { availableLanguages } from "./constants";
import SandboxLocalStorageHandler from "./SandboxLocalStorageHandler";
import { SuccessModalProvider } from "@/contexts/useSuccessModal";

export default function SandboxWrapper() {
    const initialValue = useMemo(() => {
        if (typeof window !== "undefined") {
            const code = window.localStorage.getItem("sandbox.code");

            return code === null ? undefined : code;
        }

        return "";
    }, []);

    return (
        <SuccessModalProvider isSolvedInitial={true}>
            <CodeEditorProvider>
                <SandboxLocalStorageHandler />
                <div className="grid md:flex flex-col md:flex-row gap-4 md:h-130">
                    <Output className="max-h-[250px] md:max-h-none md:max-w-sm md:min-w-[300px] w-full md:w-[40%] h-full md:h-[calc(100%-56px)] mt-auto border-2 rounded-md transition-colors bg-bg-2" />

                    <div className="flex flex-col gap-4 w-full">
                        {/* Кнопки над редактором кода */}
                        <div className="flex justify-between items-center">
                            <RunCodeBtn apiEndpoint="/api/editor/run" />

                            <LanguageSelector
                                availableLangs={availableLanguages}
                            />
                        </div>

                        {/* Редактор кода */}
                        <div className="border-2 rounded-md bg-bg-2 h-[400px] md:h-full w-[calc(100%-1px)] overflow-hidden">
                            <CodeEditor initialValue={initialValue} />
                        </div>
                    </div>
                </div>
            </CodeEditorProvider>
        </SuccessModalProvider>
    );
}
