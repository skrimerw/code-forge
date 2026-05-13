import React from "react";
import { Button } from "../ui/button";
import { Check, ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { EditTestTaskType } from "@/lib/schemas/test-task";

interface Props {
    index: number;
    id: number;
    activeIndex: number;
    className?: string;
}

export default function AnswerCard({
    id,
    index: i,
    activeIndex,
    className,
}: Props) {
    const form = useFormContext<EditTestTaskType>();
    const { remove, move } = useFieldArray({
        name: `body.${activeIndex}.answers`,
        control: form.control,
        keyName: "label",
    });

    const activeQuestion = form.watch(`body.${activeIndex}`);

    return (
        <div
            className={cn(
                "flex gap-1.5 bg-bg-2 rounded-md shadow-xs p-2 border items-center",
                className,
            )}
        >
            <Button
                type="button"
                variant={"ghost"}
                className="p-0 size-7! text-primary/50 dark:text-white/50 cursor-grab active:cursor-grabbing"
                asChild
            >
                <span>
                    <GripVertical />
                </span>
            </Button>
            {activeQuestion.type === "singular" && (
                <div
                    className={cn(
                        "relative flex size-5 items-center justify-center flex-none rounded-full border-2 border-foreground/50 hover:border-foreground transition-colors cursor-pointer",
                        activeQuestion.actualAnswer === id &&
                            "border-blue-500 hover:border-blue-500",
                    )}
                    onClick={() =>
                        form.setValue(`body.${activeIndex}.actualAnswer`, id)
                    }
                >
                    <span
                        className={cn(
                            "flex bg-blue-500 size-[20px] flex-none rounded-full scale-0 transition-transform",
                            form.watch(`body.${activeIndex}`).actualAnswer ===
                                id && "scale-50",
                        )}
                    ></span>
                </div>
            )}

            {activeQuestion.type === "multiple" &&
                activeQuestion.actualAnswer instanceof Array && (
                    <div
                        className={cn(
                            "relative flex size-5 items-center justify-center flex-none rounded-xs border-2 border-foreground/50 hover:border-foreground transition-colors cursor-pointer",
                            activeQuestion.actualAnswer.includes(id) &&
                                "border-blue-500 bg-blue-500 hover:border-blue-500",
                        )}
                        onClick={() => {
                            const actualAnswers = activeQuestion.actualAnswer;
                            let finalAnswers: number[] = [];

                            if (actualAnswers instanceof Array)
                                if (actualAnswers.includes(id)) {
                                    finalAnswers = actualAnswers.filter(
                                        (ans) => ans !== id,
                                    );
                                } else {
                                    finalAnswers = [...actualAnswers, id];
                                }

                            form.setValue(
                                `body.${activeIndex}.actualAnswer`,
                                finalAnswers,
                            );
                        }}
                    >
                        <Check
                            strokeWidth={2.5}
                            className={cn(
                                "flex bg-blue-500 size-[32px] flex-none rounded-full scale-0 transition-transform text-white",
                                (
                                    form.watch(`body.${activeIndex}`)
                                        .actualAnswer as number[]
                                ).includes(id) && "scale-50",
                            )}
                        />
                    </div>
                )}
            <Input
                {...form.register(`body.${activeIndex}.answers.${i}.label`)}
                value={form.watch(`body.${activeIndex}.answers.${i}.label`)}
                className="text-sm h-8 mx-1 px-2 w-full border-0 shadow-none rounded-sm bg-black/3 hover:bg-black/3 focus-visible:bg-black/3 focus-visible:ring-1 focus-visible:ring-black/30 dark:focus-visible:ring-white/50"
            />
            <div className="flex items-center">
                <Button
                    disabled={i === 0}
                    variant={"ghost"}
                    type="button"
                    onClick={() => move(i, i - 1)}
                    className="p-0 size-7!"
                >
                    <span>
                        <ChevronUp />
                    </span>
                </Button>
                <Button
                    disabled={i === activeQuestion.answers.length - 1}
                    variant={"ghost"}
                    type="button"
                    onClick={() => move(i, i + 1)}
                    className="p-0 size-7!"
                >
                    <span>
                        <ChevronDown />
                    </span>
                </Button>
                {activeQuestion.answers.length > 2 && (
                    <Button
                        onClick={() => {
                            remove(i);
                            if (activeQuestion.actualAnswer === id) {
                                form.setValue(
                                    `body.${activeIndex}.actualAnswer`,
                                    activeQuestion.answers[0].id,
                                );
                            }
                        }}
                        variant={"ghost"}
                        type="button"
                        className="p-0 size-7!"
                        asChild
                    >
                        <span>
                            <X />
                        </span>
                    </Button>
                )}
            </div>
        </div>
    );
}
