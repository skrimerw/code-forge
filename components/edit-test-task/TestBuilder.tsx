"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import AnswerList from "./AnswerList";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { EditTestTaskType } from "@/lib/schemas/test-task";
import { cn, getEmptyQuestion } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function TestBuilder() {
    const [activeIndex, setActiveIndex] = useState(0);
    const form = useFormContext<EditTestTaskType>();

    useEffect(() => {
        if (!form.formState.isValid) {
            const firstInvalidIndex =
                (form.formState.errors.body as any[])?.findIndex(
                    (item) => item !== undefined,
                ) || 0;

            setActiveIndex(firstInvalidIndex);
        }
    }, [form.formState.errors]);

    const questions = form.watch("body");

    const { fields, append, remove } = useFieldArray({
        name: "body",
        control: form.control,
    });

    function addNewQuestion() {
        if (questions.length === 50) return;

        append(getEmptyQuestion());
        setActiveIndex(questions.length);
    }

    function setSingular() {
        const { type: curType, actualAnswer } = form.getValues(
            `body.${activeIndex}`,
        );

        if (curType === "singular") return;

        if (actualAnswer instanceof Array) {
            form.setValue(`body.${activeIndex}.type`, "singular");

            form.setValue(`body.${activeIndex}.actualAnswer`, actualAnswer[0]);
        }
    }

    function setMultiple() {
        const { type: curType, actualAnswer } = form.getValues(
            `body.${activeIndex}`,
        );

        if (curType === "multiple") return;

        if (typeof actualAnswer === "number") {
            form.setValue(`body.${activeIndex}.type`, "multiple");

            form.setValue(`body.${activeIndex}.actualAnswer`, [actualAnswer]);
        }
    }

    return (
        <div>
            <div className="flex gap-2 flex-wrap">
                {fields.map(({ id }, i) => {
                    return (
                        <Button
                            variant={activeIndex === i ? "default" : "outline"}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            key={id}
                            className={cn(
                                "size-14 border text-2xl font-semibold",
                                (form.formState.errors.body as any[])?.at(i) !==
                                    undefined &&
                                    "ring-3 ring-red-400/40 border-red-400",
                            )}
                        >
                            {i + 1}
                        </Button>
                    );
                })}
                <Button
                    disabled={questions.length === 50}
                    variant={"outline"}
                    type="button"
                    onClick={() => addNewQuestion()}
                    className="size-14 border text-2xl font-semibold"
                >
                    <Plus />
                </Button>
            </div>
            <Controller
                name={`body.${activeIndex}.title`}
                render={({ fieldState }) => {
                    const errorMsg = fieldState.error?.message;
                    return (
                        <div className="w-full relative mt-5">
                            <div className="flex justify-between w-full mb-1">
                                <Label
                                    htmlFor={`body.${activeIndex}.title`}
                                    className="text-base w-fit"
                                >
                                    Вопрос
                                </Label>

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant={"link"}
                                        className="p-0 text-red-500 text-sm active:scale-100"
                                        onClick={() => {
                                            setActiveIndex((prev) => prev - 1);
                                            remove(activeIndex);
                                        }}
                                    >
                                        <Trash2 className="size-4!" />
                                        Удалить вопрос
                                    </Button>
                                )}
                            </div>
                            <Input
                                id={`body.${activeIndex}.title`}
                                /*  defaultValue={form.getValues(
                                    `body.${activeIndex}.title`,
                                )} */
                                value={form.watch(`body.${activeIndex}.title`)}
                                className={cn(
                                    errorMsg &&
                                        "focus-visible:ring-red-400/40 border-red-400 focus-visible:border-red-400",
                                )}
                                placeholder="Введите текст вопроса"
                                {...form.register(`body.${activeIndex}.title`)}
                            />
                            <span className={cn("text-sm text-red-400")}>
                                {errorMsg}
                            </span>
                        </div>
                    );
                }}
            />

            <div className="mt-2.5">
                <div className="w-fit mb-2">
                    <h2 className="font-medium">Количество ответов</h2>
                    <div className="flex rounded-md border shadow-xs bg-bg-2 h-fit divide-x overflow-hidden">
                        <div
                            className={cn(
                                "px-2 py-1 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all active:bg-black/10 dark:active:bg-white/10",
                                questions[activeIndex].type === "singular" &&
                                    "bg-black/5 dark:bg-white/5",
                            )}
                            onClick={setSingular}
                        >
                            Один
                        </div>
                        <div
                            className={cn(
                                "px-2 py-1 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all active:bg-black/10 dark:active:bg-white/10",
                                questions[activeIndex].type === "multiple" &&
                                    "bg-black/5 dark:bg-white/5",
                            )}
                            onClick={setMultiple}
                        >
                            Несколько
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="font-medium">Варианты ответа</h3>
                        <p className="text-sm text-typography-secondary">
                            Добавьте варианты ответа и отметьте правильные.
                        </p>
                    </div>
                </div>

                <AnswerList activeIndex={activeIndex} />
            </div>
        </div>
    );
}
