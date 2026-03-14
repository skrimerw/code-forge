"use client";

import React from "react";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export default function StepProgressbar({ className }: Props) {
    const { step, totalSteps } = useTestTask();

    return (
        <div className={className}>
            <div className="mb-2">
                <div className="relative h-1 w-full bg-gray-200 overflow-hidden rounded-full">
                    <span
                        className="absolute top-0 left-0 inline-block h-1 bg-primary transition-[width] duration-300"
                        style={{
                            width: `${(step / totalSteps) * 100}%`,
                        }}
                    ></span>
                </div>
            </div>

            <p className="text-typography-secondary text-sm font-medium">
                Вопрос {step}/{totalSteps}
            </p>
        </div>
    );
}
