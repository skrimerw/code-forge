import React from "react";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";

interface Props {
    title: string;
    className?: string;
}

export default function SingularQuestion({ title, className }: Props) {
    const { setUserAnswers, userAnswers, testBody, step } = useTestTask();
    const { id: questionId, answers } = testBody[step - 1];

    function getDefaultValue() {
        const userAnswer = userAnswers[String(questionId)];

        if (typeof userAnswer === "number") {
            return String(userAnswer);
        }

        return undefined;
    }

    return (
        <div className={className}>
            <h2 className="font-medium mb-1">{title}</h2>
            <RadioGroup
                className="gap-2"
                defaultValue={getDefaultValue()}
                onValueChange={(value) =>
                    setUserAnswers({
                        ...userAnswers,
                        [questionId]: Number(value),
                    })
                }
            >
                {answers.map(({ id, label }) => {
                    return (
                        <Label
                            key={id}
                            htmlFor={`answer-${id}`}
                            className={cn(
                                "font-normal p-4 rounded-md border border-border transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-gray-100",
                            )}
                        >
                            <RadioGroupItem
                                value={String(id)}
                                id={`answer-${id}`}
                            />
                            {label}
                        </Label>
                    );
                })}
            </RadioGroup>
        </div>
    );
}
