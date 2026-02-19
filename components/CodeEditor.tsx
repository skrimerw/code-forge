"use client";

import { useCodeEditor } from "@/contexts/useCodeEditor";
import { Editor, OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import React from "react";

interface Props {
    className?: string;
}

export default function CodeEditor({ className }: Props) {
    const { lang, editorRef } = useCodeEditor();

    function handleEditorDidMount(editor: Parameters<OnMount>[0]) {
        editorRef.current = editor;
    }

    return (
        <Editor
            onMount={handleEditorDidMount}
            className={className}
            language={lang}
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
