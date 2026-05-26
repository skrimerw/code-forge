"use client";

import CodeEditorProvider from "@/contexts/useCodeEditor";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import LanguageSelector from "./LanguageSelector";
import RunCodeBtn from "./RunCodeBtn";
import TaskInfoTabs from "./task-info-tabs/TaskInfoTabs";
import { Prisma } from "@prisma/client";
import { availableLanguages } from "./constants";
import CodeTaskEditor from "./CodeTaskEditor";
import { SuccessModalProvider } from "@/contexts/useSuccessModal";
import SuccessModal from "./SuccessModal";

interface Props {
    variants: Prisma.CodeTaskVariantGetPayload<{
        include: { codeTaskSolutions: true };
    }>[];
    taskId: number;
    themeTitle: string;
    themeContent: string;
    description: string;
    isSolved: boolean;
    className?: string;
}

export default function CodeEditorWrapper({
    isSolved,
    themeTitle,
    themeContent,
    variants,
    taskId,
    description,
    className,
}: Props) {
    const availableTaskLangs = useMemo(() => {
        const allTaskLangs = variants.map(({ lang }) => lang);

        return availableLanguages.filter(({ value }) =>
            allTaskLangs.includes(value),
        );
    }, []);

    return (
        <SuccessModalProvider isSolvedInitial={isSolved}>
            <CodeEditorProvider>
                <div
                    className={cn(
                        "flex flex-col md:flex-row gap-4 md:h-130",
                        className,
                    )}
                >
                    <SuccessModal />
                    <TaskInfoTabs
                        className="max-h-80 md:max-h-none"
                        themeTitle={themeTitle}
                        themeContent={themeContent}
                        description={description}
                    />

                    <div className="flex flex-col gap-4 w-full">
                        {/* Кнопки над редактором кода */}
                        <div className="flex justify-between items-center">
                            <RunCodeBtn
                                apiEndpoint={`/api/editor/run/code-task/${taskId}`}
                            />

                            <LanguageSelector
                                availableLangs={availableTaskLangs}
                            />
                        </div>

                        {/* Редактор кода */}
                        <div className="border-2 rounded-md bg-bg-2 h-[400px] md:h-full w-[calc(100%-1px)] overflow-hidden">
                            <CodeTaskEditor variants={variants} />
                        </div>
                    </div>
                </div>
            </CodeEditorProvider>
        </SuccessModalProvider>
    );
}
