"use client";

import CodeEditorProvider from "@/contexts/useCodeEditor";
import React from "react";
import { cn } from "@/lib/utils";
import LanguageSelector from "./LanguageSelector";
import CodeEditor from "./CodeEditor";
import RunCodeBtn from "./RunCodeBtn";
import TaskInfoTabs from "./task-info-tabs/TaskInfoTabs";
import { Prisma } from "@prisma/client";

interface Props {
    variants: Prisma.CodeTaskVariantGetPayload<{
        include: { codeTaskSolutions: true };
    }>[];
    taskId: number;
    description: string;
    className?: string;
}

export default function CodeEditorWrapper({
    variants,
    taskId,
    description,
    className,
}: Props) {
    return (
        <CodeEditorProvider>
            <div className={cn("flex gap-4 h-130", className)}>
                <TaskInfoTabs description={description} />

                <div className="flex flex-col gap-4 w-full">
                    {/* Кнопки над редактором кода */}
                    <div className="flex justify-between items-center">
                        <RunCodeBtn
                            apiEndpoint={`/api/editor/run/code-task/${taskId}`}
                        />

                        <LanguageSelector />
                    </div>

                    {/* Редактор кода */}
                    <div className="border-2 rounded-md bg-white h-full w-full overflow-hidden">
                        <CodeEditor variants={variants} />
                    </div>
                </div>
            </div>
        </CodeEditorProvider>
    );
}
