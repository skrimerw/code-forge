"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";
import { useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    label?: string;
    name: string;
    className?: string;
}

export default function FormInput({
    label,
    name,
    placeholder,
    className,
    ...props
}: Props) {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const [typeToggle, setTypeToggle] = useState(props.type);

    const errorMsg = errors[name]?.message as string;
    const uniqueId = String(useId());
    const initialType = props.type;

    return (
        <div className={cn("", className)}>
            {label && (
                <Label
                    htmlFor={uniqueId}
                    className="block text-base w-fit mb-1.5"
                >
                    {label}
                </Label>
            )}
            <div className="relative">
                <Input
                    id={uniqueId}
                    placeholder={placeholder}
                    className={cn(
                        "text-base",
                        errorMsg &&
                            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                        initialType === "password" && "pr-9",
                    )}
                    {...register(name)}
                    {...props}
                    type={typeToggle}
                />
                {initialType === "password" && !props.disabled && (
                    <button
                        type="button"
                        className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 text-typography-gray p-1.5 rounded-lg focus-visible:ring-0"
                        onClick={() =>
                            setTypeToggle((prev) =>
                                prev === "password" ? "text" : "password",
                            )
                        }
                    >
                        {typeToggle === "password" ? (
                            <Eye size={20} />
                        ) : (
                            <EyeOff size={20} />
                        )}
                    </button>
                )}
            </div>
            {errorMsg && (
                <span className="block text-red-400 text-sm mt-1">
                    {errorMsg}
                </span>
            )}
        </div>
    );
}
