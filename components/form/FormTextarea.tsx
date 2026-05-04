"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useId } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
    label?: string;
    required?: boolean;
    name: string;
    className?: string;
}

export default function FormTextarea({
    label,
    name,
    placeholder,
    className,
    required,
    ...props
}: Props) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const errorMsg = errors[name]?.message as string;
    const uniqueId = String(useId());

    return (
        <div className={cn("", className)}>
            {label && (
                <Label
                    htmlFor={uniqueId}
                    className="block text-base w-fit mb-1.5"
                >
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </Label>
            )}
            <div className="relative">
                <Textarea
                    id={uniqueId}
                    placeholder={placeholder}
                    className={cn(
                        "text-base",
                        errorMsg &&
                            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200 dark:focus-visible:ring-red-500/30",
                    )}
                    {...register(name)}
                    {...props}
                    rows={5}
                />
            </div>
            {errorMsg && (
                <span className="block text-red-400 text-sm mt-1">
                    {errorMsg}
                </span>
            )}
        </div>
    );
}
