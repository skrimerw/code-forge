"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CodeTask, Difficulty } from "@prisma/client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormTextarea from "../form/FormTextarea";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { EditCodeTaskSchema, EditCodeTaskType } from "@/lib/schemas/code-task";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DifficultyBadge from "../DifficultyBadge";
import Link from "next/link";

interface Props {
    themeTitle: string;
    task: CodeTask;
    initialCode: string;
    testCode: string;
    className?: string;
}

export default function EditCodeTaskForm({
    themeTitle,
    task,
    initialCode,
    testCode,
    className,
}: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(EditCodeTaskSchema),
        defaultValues: {
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            initialCode: initialCode,
            testCode: testCode,
        },
    });

    async function onSubmit(data: EditCodeTaskType) {
        try {
            setLoading(true);

            await axios.post(`/api/code-task/${task.id}`, data);

            toast.success("Данные сохранены");
        } catch (e) {
            console.log(e);
            toast.error("Не удалось сохранить данные");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Link
                href={".."}
                className="flex items-center hover:underline gap-2 mb-5"
            >
                <ArrowLeft size={18} /> {themeTitle}
            </Link>
            <FormProvider {...form}>
                <form
                    className={cn("flex flex-col gap-4 max-w-3xl", className)}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="flex gap-4 items-end w-full">
                        <FormInput
                            name="title"
                            defaultValue={task.title}
                            label="Название"
                            placeholder="Введите название"
                            className="w-full"
                        />
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger className="focus-visible:outline-0!">
                                <DifficultyBadge
                                    className="w-[120px]! text-base h-10.5 items-center flex capitalize flex-none text-center rounded-sm ml-auto px-2 cursor-pointer hover:brightness-95 transition-all"
                                    difficulty={
                                        form.watch("difficulty") as Difficulty
                                    }
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {Object.keys(Difficulty).map((diff) => {
                                    return (
                                        <DropdownMenuItem
                                            key={diff}
                                            onClick={() =>
                                                form.setValue(
                                                    "difficulty",
                                                    diff,
                                                )
                                            }
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
                    </div>
                    <FormTextarea
                        name="description"
                        defaultValue={task.description}
                        label="Описание"
                        placeholder="Введите описание"
                    />
                    <FormTextarea
                        name="initialCode"
                        defaultValue={initialCode}
                        label="Начальный код"
                        placeholder="Введите начальный код"
                    />
                    <FormTextarea
                        name="testCode"
                        defaultValue={testCode}
                        label="Тестовый код"
                        placeholder="Введите тестовый код"
                    />

                    <Button className="w-fit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Save />
                        )}
                        Сохранить
                    </Button>
                </form>
            </FormProvider>
        </div>
    );
}
