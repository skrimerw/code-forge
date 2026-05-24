import { Star } from "lucide-react";
import React from "react";

interface Props {
    fillPercentage?: number;
    className?: string;
}

export default function RatingStar({ fillPercentage = 100, className }: Props) {
    return (
        <div className={className}>
            <div className="relative">
                <Star
                    size={20}
                    strokeWidth={1.5}
                    clipPath={`inset(0 ${100 - fillPercentage}% 0 0)`}
                    className="fill-yellow-500 stroke-yellow-500 dark:fill-yellow-600 dark:stroke-yellow-600"
                />
                <Star
                    size={20}
                    strokeWidth={1.5}
                    className="absolute -z-1 top-0 fill-gray-300 stroke-gray-300 dark:fill-[#444] dark:stroke-[#444]"
                />
            </div>
        </div>
    );
}
