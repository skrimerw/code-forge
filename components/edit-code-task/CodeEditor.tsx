import React, { useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useTheme } from "@/contexts/useTheme";
import { Label } from "../ui/label";
import { Controller, UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditCodeTaskType } from "@/lib/schemas/code-task";

interface Props {
    name: keyof EditCodeTaskType;
    label: string;
    form: UseFormReturn<EditCodeTaskType>;
    description?: React.ReactNode;
    className?: string;
}

export default function CodeEditor({
    label,
    name,
    description,
    form,
    className,
}: Props) {
    const { theme } = useTheme();
    const editorRef = useRef<ReactCodeMirrorRef | null>(null);

    return (
        <div className={className}>
            <Label
                className="text-base mb-1.5 w-fit"
                onClick={() => editorRef.current?.view?.focus()}
            >
                {label}
            </Label>
            {description}
            <Controller
                name={name}
                render={({ fieldState }) => {
                    const errorMsg = fieldState.error?.message;

                    return (
                        <div>
                            <div
                                className={cn(
                                    "relative h-[200px] rounded-md overflow-hidden border shadow-xs",
                                    errorMsg && "border-red-400",
                                )}
                            >
                                <div className="absolute inset-0 flex justify-center flex-col gap-2.5 items-center bg-bg-2">
                                    <Loader2
                                        size={40}
                                        className="animate-spin text-foreground"
                                    />
                                    <p>Загружаем редактор кода</p>
                                </div>
                                <CodeMirror
                                    ref={editorRef}
                                    value={form.watch(
                                        name as keyof EditCodeTaskType,
                                    )}
                                    height="200px"
                                    theme={theme}
                                    extensions={[javascript()]}
                                    onChange={(val) =>
                                        form.setValue(
                                            name as keyof EditCodeTaskType,
                                            val,
                                            {
                                                shouldValidate: true,
                                            },
                                        )
                                    }
                                />
                            </div>
                            <span className={cn("text-sm text-red-400")}>
                                {errorMsg}
                            </span>
                        </div>
                    );
                }}
            />
        </div>
    );
}
