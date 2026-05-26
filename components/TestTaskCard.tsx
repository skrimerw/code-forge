import React from "react";
import DifficultyBadge from "./DifficultyBadge";
import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { CheckCircle2, Target, X } from "lucide-react";
import { TestBody } from "@/lib/mock-test";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import TestModal from "./tests/TestModal";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
    id: number;
    title: string;
    difficulty: Difficulty;
    testBody: TestBody;
    successRate: { id: number; success_rate: number; total_solutions: number };
    isSolved?: boolean;
    className?: string;
}

export default function TestTaskCard({
    id,
    isSolved = false,
    difficulty,
    title,
    successRate,
    testBody,
    className,
}: Props) {
    const successPercent = (successRate.success_rate * 100).toLocaleString(
        "ru-RU",
        {
            maximumFractionDigits: 2,
        },
    );

    return (
        <Dialog>
            <DialogTrigger>
                <div
                    className={cn(
                        "flex items-center justify-between rounded-lg bg-bg-2 p-4 pl-6 cursor-pointer transition-all duration-300 hover:shadow",
                        className,
                    )}
                >
                    <div className="flex items-center gap-3">
                        <h4>{title}</h4>
                        {isSolved && (
                            <CheckCircle2 className="text-easy-foreground" />
                        )}
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="ml-auto mr-4 flex items-center text-sm gap-1 font-medium">
                                <Target
                                    className="text-foreground"
                                    size={18}
                                    strokeWidth={1.5}
                                />
                                {successPercent}%{" "}
                                <span className="font-normal">из</span>{" "}
                                {successRate.total_solutions}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-fit max-w-[250px] text-center">
                            {successPercent}% пользователей из{" "}
                            {successRate.total_solutions}, взявших это задание,
                            успешно решили его.
                        </TooltipContent>
                    </Tooltip>
                    <DifficultyBadge difficulty={difficulty} />
                </div>
            </DialogTrigger>
            <DialogDescription />
            <DialogTitle />
            <DialogContent
                className=" w-full shadow-md mx-auto max-w-lg p-0"
                showCloseButton={false}
            >
                <div className="relative">
                    <DialogClose className="absolute -right-14" asChild>
                        <Button
                            variant={"secondary"}
                            className="size-10 flex items-center justify-center bg-bg-2 shadow-md rounded-full cursor-pointer hover:bg-secondary text-foreground"
                        >
                            <X />
                        </Button>
                    </DialogClose>
                    <div className="rounded-md overflow-hidden">
                        <TestModal testId={id} testBody={testBody} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
