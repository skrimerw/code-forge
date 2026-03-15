import React from "react";
import DifficultyBadge from "./DifficultyBadge";
import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { CheckCircle2, X } from "lucide-react";
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

interface Props {
    id: number;
    title: string;
    difficulty: Difficulty;
    testBody: TestBody;
    isSolved?: boolean;
    className?: string;
}

export default function TestTaskCard({
    id,
    isSolved = false,
    difficulty,
    title,
    testBody,
    className,
}: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                <div
                    className={cn(
                        "flex items-center justify-between rounded-lg bg-bg-2 p-4 pl-6 cursor-pointer transition-all duration-300 hover:scale-101 hover:shadow",
                        className,
                    )}
                >
                    <div className="flex items-center gap-3">
                        <h4>{title}</h4>
                        {isSolved && (
                            <CheckCircle2 className="text-easy-foreground" />
                        )}
                    </div>
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
                        <Button className="size-10 flex items-center justify-center bg-bg-2 shadow-md rounded-full cursor-pointer hover:bg-secondary">
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
