import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { cva } from "class-variance-authority";
import React from "react";

interface Props {
    difficulty: Difficulty;
    className?: string;
}

const variants = cva(
    "font-medium text-sm w-[70px] flex justify-center items-center rounded-full border-2",
    {
        variants: {
            difficulty: {
                [Difficulty.EASY]:
                    "border-easy-foreground text-easy-foreground bg-easy-background",
                [Difficulty.MEDIUM]:
                    "border-medium-foreground text-medium-foreground bg-medium-background",
                [Difficulty.HARD]:
                    "border-hard-foreground text-hard-foreground bg-hard-background",
            },
        },
    },
);

const text = {
    [Difficulty.EASY]: "легко",
    [Difficulty.MEDIUM]: "средне",
    [Difficulty.HARD]: "сложно",
};

export default function DifficultyBadge({ difficulty, className }: Props) {
    return (
        <div className={cn("", variants({ difficulty }), className)}>
            {text[difficulty]}
        </div>
    );
}
