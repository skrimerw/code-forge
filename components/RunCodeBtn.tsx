"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCodeEditor } from "@/contexts/useCodeEditor";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
    className?: string;
}

export default function RunCodeBtn({ className }: Props) {
    const [loading, setLoading] = useState(false);
    const { editorRef, setOutput, lang } = useCodeEditor();

    async function handleRunClick() {
        if (editorRef.current) {
            const code = editorRef.current.getValue();

            if (code.length === 0) {
                toast.error("Похоже, вы не добавили код")
                
                return
            }

            try {
                setLoading(true);

                const { data } = await axios.post("/api/editor/run", {
                    lang,
                    code,
                });

                setOutput(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (loading) return;

        if (e.ctrlKey && e.key === "Enter") {
            handleRunClick();
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [loading, lang]);

    return (
        <Button
            className={cn(
                "h-10 bg-easy-foreground text-white hover:bg-easy-foreground/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]",
                className,
            )}
            disabled={loading}
            onClick={handleRunClick}
        >
            {loading ? <Loader2 className="animate-spin" /> : <Play />}
            Запустить
        </Button>
    );
}
