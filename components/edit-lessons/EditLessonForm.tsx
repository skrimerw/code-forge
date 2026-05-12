"use client";

import React, { useState } from "react";
import {
    Controller,
    FormProvider,
    useFieldArray,
    useForm,
} from "react-hook-form";
import FormInput from "../form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2, PlusCircle, Save, X } from "lucide-react";
import FormTextarea from "../form/FormTextarea";
import { CodeTask, Difficulty, Theme } from "@prisma/client";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { EditLessonSchema, EditLessonType } from "@/lib/schemas/edit-lesson";
import axios from "axios";
import CourseCover from "../icons/CourseCover";
import { Input } from "../ui/input";
import DifficultyBadge from "../DifficultyBadge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    codeTasks: CodeTask[];
    initialData: Theme;
    className?: string;
}

export default function EditLessonForm({
    codeTasks,
    initialData,
    className,
}: Props) {
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [newCodeTask, setNewCodeTask] = useState("");
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(EditLessonSchema),
        defaultValues: {
            title: initialData.title,
            description: initialData.description,
            content: initialData.content,
            codeTasks: codeTasks.map((task) => ({ ...task, fakeId: task.id })),
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "codeTasks",
        control: form.control,
    });

    async function onSubmit(data: EditLessonType) {
        console.log(data);

        try {
            setLoading(true);
            const { data: respData } = await axios.post(
                `/api/themes/${initialData.id}`,
                {
                    ...data,
                    codeTasks: data.codeTasks.filter(
                        (task) => !deletedIds.includes(task.fakeId),
                    ),
                },
            );

            form.reset({
                ...respData,
                codeTasks: respData.codeTasks.map((task: CodeTask) => ({
                    ...task,
                    fakeId: task.id,
                })),
            });

            toast.success("Данные сохранены");
        } catch (e) {
            console.log(e);
            toast.error("Не удалось сохранить данные");
        } finally {
            setLoading(false);
        }
    }

    function appendNewCodeTask() {
        const codeTasks = form.getValues("codeTasks");

        if (codeTasks.length === 10) {
            toast.warning("Можно добавить не более 10 заданий");
            return;
        }

        append(
            {
                fakeId: -1,
                difficulty: Difficulty.EASY,
                title: newCodeTask,
            },
            {
                shouldFocus: false,
            },
        );

        requestAnimationFrame(() => {
            window.scrollBy({
                top: 77.5,
            });
        });

        setNewCodeTask("");
    }

    function changeDifficulty(index: number, diff: Difficulty) {
        form.setValue(`codeTasks.${index}.difficulty`, diff);

        requestAnimationFrame(() => {
            form.getValues(`codeTasks.${index}.difficulty`);
        });
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-4 w-full max-w-3xl", className)}
            >
                <FormInput
                    name="title"
                    label="Название"
                    placeholder="Введите название"
                    defaultValue={initialData.title}
                    className="max-w-3xl"
                />
                <FormTextarea
                    name="description"
                    label="Краткое описание"
                    placeholder="Введите описание"
                    defaultValue={initialData.description}
                    className="[&>div>textarea]:max-h-[350px]"
                />
                <FormTextarea
                    name="content"
                    label="Текст статьи"
                    placeholder="Введите текст статьи"
                    defaultValue={initialData.content}
                    className="[&>div>textarea]:max-h-[350px]"
                />

                <div className="mt-10">
                    <h2 className="font-medium mb-2 text-2xl">Задания</h2>

                    <div className="flex flex-col gap-2 mb-4">
                        {fields.map(({ id, fakeId, title }, i) => {
                            return (
                                <div
                                    key={id}
                                    className="flex items-center border shadow-xs rounded-md bg-bg-2 p-2 pl-5"
                                >
                                    {deletedIds.includes(fakeId) ? (
                                        <div className="flex justify-between items-center gap-4 py-2.5 pr-3 w-full">
                                            <p className="text-primary/50 dark:text-white/60">
                                                Задание «
                                                <span className="font-bold">
                                                    {form.getValues(
                                                        `codeTasks.${i}.title`,
                                                    )}
                                                </span>
                                                » будет удалено после сохранения
                                            </p>
                                            <Button
                                                className="p-0 text-blue-500 dark:text-blue-500/80"
                                                type="button"
                                                onClick={() => {
                                                    setDeletedIds((prev) =>
                                                        prev.filter(
                                                            (delId) =>
                                                                delId !==
                                                                fakeId,
                                                        ),
                                                    );
                                                }}
                                                variant={"link"}
                                            >
                                                Восстановить
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 w-full items-center">
                                            <span className="font-mono mr-1">
                                                {i + 1}.
                                            </span>
                                            <Controller
                                                name={`codeTasks.${i}.title`}
                                                render={({ fieldState }) => {
                                                    const errorMsg =
                                                        fieldState.error
                                                            ?.message;
                                                    return (
                                                        <div className="w-full relative mr-4">
                                                            <Input
                                                                defaultValue={
                                                                    title
                                                                }
                                                                className={cn(
                                                                    "text-lg w-full border-0 shadow-none bg-transparent hover:bg-black/3 focus-visible:bg-black/3 focus-visible:ring-1 focus-visible:ring-black/30",
                                                                    errorMsg &&
                                                                        "focus-visible:ring-red-600",
                                                                )}
                                                                {...form.register(
                                                                    `codeTasks.${i}.title`,
                                                                )}
                                                            />
                                                            <span
                                                                className={cn(
                                                                    "text-sm text-red-600",
                                                                )}
                                                            >
                                                                {errorMsg}
                                                            </span>
                                                        </div>
                                                    );
                                                }}
                                            />

                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger className="focus-visible:outline-0!">
                                                    <DifficultyBadge
                                                        className="block w-[70px]! flex-none text-center rounded-sm ml-auto px-2 cursor-pointer hover:brightness-95 transition-all"
                                                        difficulty={
                                                            form.watch(
                                                                `codeTasks.${i}.difficulty`,
                                                            ) as Difficulty
                                                        }
                                                    />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {Object.keys(
                                                        Difficulty,
                                                    ).map((diff) => {
                                                        return (
                                                            <DropdownMenuItem
                                                                key={diff}
                                                                onClick={() =>
                                                                    changeDifficulty(
                                                                        i,
                                                                        diff as Difficulty,
                                                                    )
                                                                }
                                                            >
                                                                <DifficultyBadge
                                                                    className="w-full block bg-transparent border-0 rounded-sm ml-auto px-2 cursor-pointer hover:brightness-95 transition-all text-base font-normal"
                                                                    difficulty={
                                                                        diff as Difficulty
                                                                    }
                                                                />
                                                            </DropdownMenuItem>
                                                        );
                                                    })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            {fakeId !== -1 && (
                                                <Button
                                                    type="button"
                                                    variant={"secondary"}
                                                    asChild
                                                >
                                                    <Link
                                                        href={`${pathname}/code-tasks/${fakeId}`}
                                                    >
                                                        Редактировать
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => {
                                                    if (fakeId !== -1) {
                                                        setDeletedIds(
                                                            (prev) => [
                                                                ...prev,
                                                                fakeId,
                                                            ],
                                                        );
                                                    } else {
                                                        remove(i);
                                                    }
                                                }}
                                                type="button"
                                                variant={"ghost"}
                                                className="size-10.5! p-0"
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-5">
                        <div className="size-16 overflow-hidden object-cover flex-none">
                            <CourseCover className="size-full" />
                        </div>
                        <Input
                            value={newCodeTask}
                            onChange={(e) => setNewCodeTask(e.target.value)}
                            placeholder="Введите название нового задания и нажмите Enter"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.stopPropagation();

                                    if (newCodeTask.length > 0) {
                                        appendNewCodeTask();
                                    }
                                }
                            }}
                        />
                        <Button
                            className="h-fit"
                            type="button"
                            onClick={appendNewCodeTask}
                            disabled={newCodeTask.length === 0}
                        >
                            <PlusCircle />
                            Создать задание
                        </Button>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={loading}
                    className="w-fit px-7"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save />}
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
}
