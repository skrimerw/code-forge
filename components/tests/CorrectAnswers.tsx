import React from "react";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
    className?: string;
}

export default function CorrectAnswers({ className }: Props) {
    const { testBody, userAnswers } = useTestTask();

    function getScoreStr(score: number) {
        let res = score + " ";

        const lastDigit = score % 10;
        const lastTwoDigits = score % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            res += "баллов";
        } else {
            switch (lastDigit) {
                case 1:
                    res += "балл";
                    break;
                case 2:
                case 3:
                case 4:
                    res += "балла";
                    break;
                default:
                    res += "баллов";
            }
        }

        return res;
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {testBody.map(
                ({ title, actualAnswer, id: questionId, answers, type }) => {
                    const correctAnswers = Array.isArray(actualAnswer)
                        ? actualAnswer
                        : [actualAnswer];

                    const userAnswersForQuestion = userAnswers[questionId];
                    const userAnswerArray = Array.isArray(
                        userAnswersForQuestion,
                    )
                        ? userAnswersForQuestion
                        : userAnswersForQuestion
                          ? [userAnswersForQuestion]
                          : [];

                    const correctUserAnswers = new Set(
                        correctAnswers,
                    ).intersection(new Set(userAnswerArray));

                    const score =
                        correctUserAnswers.size / correctAnswers.length;

                    return (
                        <div
                            key={questionId}
                            className="border border-border rounded-md shadow-2xs p-4"
                        >
                            <div className="flex justify-between">
                                <h3 className="font-medium mb-1">{title}</h3>
                                <span className="text-xs font-medium text-typography-secondary">
                                    {getScoreStr(score)}
                                </span>
                            </div>

                            <ul>
                                {answers.map(({ label, id }) => {
                                    return (
                                        <li
                                            key={id}
                                            className={cn(
                                                "flex items-center gap-2 text-sm",
                                                correctAnswers.includes(id) &&
                                                    "text-easy-foreground",
                                                userAnswerArray.includes(id) &&
                                                    !correctAnswers.includes(
                                                        id,
                                                    ) &&
                                                    "text-hard-foreground",
                                            )}
                                        >
                                            {type === "multiple" ? (
                                                <Checkbox
                                                    className={cn(
                                                        "opacity-100! cursor-default!",
                                                        correctAnswers.includes(
                                                            id,
                                                        ) &&
                                                            "[&[data-state=checked]]:bg-easy-foreground [&[data-state=checked]]:border-easy-foreground",
                                                        userAnswerArray.includes(
                                                            id,
                                                        ) &&
                                                            !correctAnswers.includes(
                                                                id,
                                                            ) &&
                                                            "[&[data-state=checked]]:bg-hard-foreground [&[data-state=checked]]:border-hard-foreground",
                                                    )}
                                                    defaultChecked={userAnswerArray.includes(
                                                        id,
                                                    )}
                                                    disabled
                                                />
                                            ) : (
                                                <RadioGroup
                                                    defaultValue={String(
                                                        userAnswerArray[0],
                                                    )}
                                                    disabled
                                                >
                                                    <RadioGroupItem
                                                        className={cn(
                                                            "opacity-100! cursor-default!",
                                                            correctAnswers.includes(
                                                                id,
                                                            ) &&
                                                                "[&[data-state=checked]]:bg-easy-foreground [&[data-state=checked]]:border-easy-foreground",
                                                            userAnswerArray.includes(
                                                                id,
                                                            ) &&
                                                                !correctAnswers.includes(
                                                                    id,
                                                                ) &&
                                                                "[&[data-state=checked]]:bg-hard-foreground [&[data-state=checked]]:border-hard-foreground",
                                                        )}
                                                        value={String(id)}
                                                    />
                                                </RadioGroup>
                                            )}
                                            {label}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                },
            )}
        </div>
    );
}
