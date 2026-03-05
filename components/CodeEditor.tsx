"use client";

import { useCodeEditor } from "@/contexts/useCodeEditor";
import { Editor, OnMount } from "@monaco-editor/react";
import { Prisma } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, { useCallback, useMemo } from "react";

interface Props {
    variants: Prisma.CodeTaskVariantGetPayload<{
        include: { codeTaskSolutions: true };
    }>[];
    className?: string;
}

export default function CodeEditor({ variants, className }: Props) {
    const { lang, editorRef } = useCodeEditor();

    function handleEditorDidMount(editor: Parameters<OnMount>[0], monaco: any) {
        editorRef.current = editor;

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true }),
            );
        });
    }

    const initialValue = useMemo(() => {
        const variant = variants.find(
            ({ lang: language }) => lang === language,
        );
        const userSolution = variant?.codeTaskSolutions;

        return userSolution?.length
            ? userSolution[0].code
            : variant?.starterCode;
    }, [lang]);

    return (
        <Editor
            onMount={handleEditorDidMount}
            className={className}
            language={lang.toLowerCase()}
            value={initialValue}
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
    );
}
