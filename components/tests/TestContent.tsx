import React from "react";
import { Button } from "../ui/button";
import StepProgressbar from "./StepProgressbar";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";
import Question from "./Question";
import { ChevronLeft } from "lucide-react";
import { UserAnswers } from "@/lib/mock-test";
import NextBtn from "./NextBtn";
import PrevBtn from "./PrevBtn";
import FinishBtn from "./FinishBtn";
import ResultScreen from "./ResultScreen";

interface Props {
    className?: string;
}

export default function TestContent({ className }: Props) {
    const { step, testBody, result } = useTestTask();

    return (
        <div className="">
            <div
                className={cn(
                    "grid bg-white max-h-[70vh] overflow-y-auto p-5",
                    className,
                )}
            >
                {!result ? (
                    <div className="col-start-1 col-end-2 row-start-1 row-end-2 transition-[height,opacity] duration-300 opacity-100 visible">
                        <StepProgressbar className="mb-4" />
                        <div className="grid">
                            {testBody.map(({ id }, i) => {
                                return (
                                    <Question
                                        key={id}
                                        questionNumber={i + 1}
                                        className={cn(
                                            "w-full mb-8 col-start-1 col-end-2 row-start-1 row-end-2 opacity-0 transition-opacity duration-300 invisible pointer-events-none",
                                            step === i + 1 &&
                                                "opacity-100 visible pointer-events-auto",
                                        )}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-4">
                            <PrevBtn />
                            <NextBtn />
                            <FinishBtn className="ml-auto" />
                        </div>
                    </div>
                ) : (
                    <ResultScreen
                        className={cn(
                            "col-start-1 col-end-2 row-start-1 row-end-2 transition-[height,opacity] duration-300 opacity-0 invisible",
                            result && "opacity-100 visible",
                        )}
                    />
                )}
            </div>
        </div>
    );
}
