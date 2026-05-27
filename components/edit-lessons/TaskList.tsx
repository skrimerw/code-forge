import React, { SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DifficultyBadge from "../DifficultyBadge";
import { Difficulty } from "@prisma/client";
import Link from "next/link";
import { Edit, PlusCircle, X } from "lucide-react";
import CourseCover from "../icons/CourseCover";
import { EditLessonType } from "@/lib/schemas/edit-lesson";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

interface Props {
    name: "codeTasks" | "testTasks";
    deletedIds: number[];
    setDeletedIds: (val: SetStateAction<number[]>) => void;
    form: UseFormReturn<EditLessonType>;
    className?: string;
}

export default function TaskList({
    name,
    form,
    deletedIds,
    setDeletedIds,
    className,
}: Props) {
    const [newCodeTask, setNewCodeTask] = useState("");
    const pathname = usePathname();

    const editUrl = name === "codeTasks" ? "code-tasks" : "test-tasks";

    const { fields, remove, append } = useFieldArray({
        control: form.control,
        name: name,
    });

    function appendNewCodeTask() {
        const codeTasks = form.getValues(name);

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
        form.setValue(`${name}.${index}.difficulty`, diff);

        requestAnimationFrame(() => {
            form.getValues(`${name}.${index}.difficulty`);
        });
    }

    return (
        <div className={className}>
            <div className="flex flex-col gap-2 mb-4">
                {fields.length === 0 ? (
                    <p className="text-center py-4 mb-[5.5px] text-typography-secondary">
                        Заданий пока нет. Добавьте первое задание
                    </p>
                ) : (
                    fields.map(({ id, fakeId, title }, i) => {
                        return (
                            <div
                                key={id}
                                className="flex items-center border shadow-xs rounded-md bg-bg-2 p-1 sm:p-2 pl-3 sm:pl-5"
                            >
                                {deletedIds.includes(fakeId) ? (
                                    <div className="flex justify-between items-center gap-4 p-1.5 sm:py-2.5 sm:pr-3 w-full">
                                        <p className="text-primary/50 dark:text-white/60">
                                            Задание «
                                            <span className="font-bold">
                                                {form.getValues(
                                                    `${name}.${i}.title`,
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
                                                            delId !== fakeId,
                                                    ),
                                                );
                                            }}
                                            variant={"link"}
                                        >
                                            Восстановить
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 sm:gap-3 w-full items-center">
                                        <span className="font-mono">
                                            {i + 1}.
                                        </span>
                                        <Controller
                                            name={`${name}.${i}.title`}
                                            render={({ fieldState }) => {
                                                const errorMsg =
                                                    fieldState.error?.message;
                                                return (
                                                    <div className="w-full relative">
                                                        <Input
                                                            defaultValue={title}
                                                            className={cn(
                                                                "h-9 sm:h-fit text-base sm:text-lg w-full border-0 shadow-none bg-transparent hover:bg-black/3 focus-visible:bg-black/3 focus-visible:ring-1 focus-visible:ring-black/30",
                                                                errorMsg &&
                                                                    "focus-visible:ring-red-600",
                                                            )}
                                                            {...form.register(
                                                                `${name}.${i}.title`,
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
                                                            `${name}.${i}.difficulty`,
                                                        ) as Difficulty
                                                    }
                                                />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {Object.keys(Difficulty).map(
                                                    (diff) => {
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
                                                    },
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {fakeId !== -1 && (
                                            <Button
                                                type="button"
                                                variant={"secondary"}
                                                className="size-9 sm:size-fit"
                                                asChild
                                            >
                                                <Link
                                                    href={`${pathname}/${editUrl}/${fakeId}`}
                                                >
                                                    <Edit className="sm:hidden" />
                                                    <span className="hidden sm:inline">
                                                        Редактировать
                                                    </span>
                                                </Link>
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => {
                                                if (fakeId !== -1) {
                                                    setDeletedIds((prev) => [
                                                        ...prev,
                                                        fakeId,
                                                    ]);
                                                } else {
                                                    remove(i);
                                                }
                                            }}
                                            type="button"
                                            variant={"ghost"}
                                            className="size-9 sm:size-10.5! p-0"
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="flex gap-2.5 sm:gap-5">
                <div className="size-12 sm:size-16 overflow-hidden object-cover flex-none">
                    <CourseCover className="size-full" />
                </div>
                <Input
                    value={newCodeTask}
                    className="h-10.5 sm:h-fit"
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
                    <span className="hidden sm:inline">Создать задание</span>
                </Button>
            </div>
        </div>
    );
}
