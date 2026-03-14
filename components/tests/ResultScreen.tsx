import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useTestTask } from "./context/useTestTask";
import Gauge from "./Gauge";
import Success from "../lottie/Success";
import Failed from "../lottie/Failed";
import { Button } from "../ui/button";
import { RefreshCwIcon } from "lucide-react";
import CorrectAnswers from "./CorrectAnswers";

interface Props {
    className?: string;
}

export default function ResultScreen({ className }: Props) {
    const { result, testBody, resetTest } = useTestTask();
    const [showAnswers, setShowAnswers] = useState(false);

    function getPercentage() {
        if (result) {
            return (result.score / testBody.length) * 100;
        }

        return 1;
    }

    const testPassed = getPercentage() >= 66;

    return (
        result !== null && (
            <div className={cn(className)}>
                <h2 className="text-center mb-0 font-semibold text-xl">
                    Тест {!testPassed && "не"} пройден
                </h2>
                <div className="mx-auto w-fit">
                    {testPassed ? (
                        <Success className="[&>svg]:h-[100px]!" />
                    ) : (
                        <div className="flex items-center h-[100px]">
                            <Failed className="[&>svg]:h-[70px]!" />
                        </div>
                    )}
                </div>
                <h3 className="text-center font-semibold mb-2">Результаты</h3>
                <div className="flex gap-6 justify-center">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-typography-secondary font-medium text-sm">
                            Точность
                        </h3>
                        <div className="flex items-end gap-2">
                            <Gauge percentage={getPercentage()} />
                            <p className="font-semibold">{getPercentage()}%</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-typography-secondary font-medium text-sm">
                            Баллы
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="relative size-5 rounded-full bg-medium-foreground">
                                <span className="absolute top-1/2 left-1/2 -translate-1/2 block bg-black size-1.5 rotate-z-45"></span>
                            </div>
                            <p className="font-semibold">{result.score}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 items-center mt-8 gap-4 justify-center">
                    <Button className="text-sm" onClick={resetTest}>
                        <RefreshCwIcon /> Начать заново
                    </Button>
                    <Button
                        onClick={() => setShowAnswers((prev) => !prev)}
                        className="text-sm"
                        variant={"secondary"}
                    >
                        {showAnswers ? "Скрыть" : "Показать"} ответы
                    </Button>
                </div>
                {
                    showAnswers && (
                        <CorrectAnswers className="mt-8" />
                    )
                }
            </div>
        )
    );
}
