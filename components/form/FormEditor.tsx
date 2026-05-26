"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import ClientSideCustomEditor from "../editor/ClientSideEditor";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

interface Props {
    required?: boolean;
    label?: string;
    name: string;
    className?: string;
}

export default function FormEditor({
    required,
    label,
    name,
    className,
}: Props) {
    const form = useFormContext();

    const errorMsg = form.formState.errors[name]?.message as string;

    return (
        <div className={cn("relative", className)}>
            <div className="flex flex-col gap-1.5">
                {label && (
                    <Label className="flex gap-px w-fit text-base">
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                )}
                <div className="relative min-h-[95px]  w-[calc(100%-1px)]">
                    <Skeleton className="absolute w-full h-[95px] flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </Skeleton>
                    <ClientSideCustomEditor
                        initialData={form.getValues(name)}
                        onChange={(_, editor) => {
                            form.setValue(name, editor.getData(), {
                                shouldValidate: true,
                            });
                        }}
                    />
                </div>
            </div>
            {errorMsg && (
                <span className="block text-red-400 text-sm mt-1">
                    {errorMsg}
                </span>
            )}
        </div>
    );
}
