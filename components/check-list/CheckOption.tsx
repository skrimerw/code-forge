import { cn } from "@/lib/utils";
import { Check, Save, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
    title: string;
    description: string;
    linkLabel: string;
    link: string;
    isValid: boolean;
    className?: string;
}

export default function CheckOption({
    title,
    description,
    isValid,
    link,
    linkLabel,
    className,
}: Props) {
    return (
        <div className={cn("flex gap-2", className)}>
            {isValid ? (
                <Check
                    className="text-green-600 flex-none mt-0.5"
                    strokeWidth={2.5}
                    size={18}
                />
            ) : (
                <X
                    className="text-rose-600 flex-none mt-0.5"
                    strokeWidth={2.5}
                    size={18}
                />
            )}
            <div className="max-w-md">
                <h3 className="font-medium text-[15px]">{title}</h3>
                <p className="text-typography-secondary text-[13px] leading-[120%]">
                    {description}
                </p>
            </div>
            <Link
                href={link}
                className={cn("ml-auto text-[15px] leading-[115%] text-blue-500 underline underline-offset-4 dark:text-blue-700 hover:text-blue-600 h-fit", isValid && "text-blue-500/50 dark:text-blue-700/50 dark:hover:text-blue-600")}
            >
                {linkLabel}
            </Link>
        </div>
    );
}

export { type Props as CheckOptionProps };
