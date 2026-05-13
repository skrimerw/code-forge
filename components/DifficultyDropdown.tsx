import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DifficultyBadge from "./DifficultyBadge";
import { Difficulty } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface Props {
    form: UseFormReturn<any>;
    className?: string;
}

export default function DifficultyDropdown({ form, className }: Props) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger
                className={cn("focus-visible:outline-0!", className)}
            >
                <DifficultyBadge
                    className="w-[120px]! text-base h-10.5 items-center flex capitalize flex-none text-center rounded-sm ml-auto px-2 cursor-pointer hover:brightness-95 transition-all"
                    difficulty={form.watch("difficulty") as Difficulty}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.keys(Difficulty).map((diff) => {
                    return (
                        <DropdownMenuItem
                            key={diff}
                            onClick={() => form.setValue("difficulty", diff)}
                        >
                            <DifficultyBadge
                                className="w-full block bg-transparent border-0 rounded-sm ml-auto px-2 cursor-pointer hover:brightness-95 transition-all text-base font-normal"
                                difficulty={diff as Difficulty}
                            />
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
