import React, { SetStateAction } from "react";
import { Button } from "../ui/button";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import MoveUp from "./MoveUp";
import MoveDown from "./MoveDown";
import Themes from "./Themes";
import { ContentSchemaType } from "@/lib/schemas/course-content";

interface Props {
    courseId: number;
    fields: any;
    move: (i: number, j: number) => void;
    remove: (i: number) => void;
    fakeId: number;
    title: string;
    index: number;
    form: UseFormReturn<ContentSchemaType>;
    deletedIds: number[];
    setDeletedIds: (val: SetStateAction<number[]>) => void;
    deletedThemeIds: number[];
    setDeletedThemeIds: (val: SetStateAction<number[]>) => void;
    className?: string;
}

export default function EditorModule({
    fakeId,
    title,
    index: i,
    fields,
    move,
    remove,
    courseId,
    form,
    deletedIds,
    setDeletedIds,
    deletedThemeIds,
    setDeletedThemeIds,
    className,
}: Props) {
    return (
        <div className={className}>
            {deletedIds.includes(fakeId) ? (
                <div className="flex justify-between items-center gap-4 p-5 border border-l-4 bg-bg-2">
                    <p className="text-primary/50 dark:text-white/60">
                        Модуль «
                        <span className="font-bold">
                            {form.getValues(`modules.${i}.title`)}
                        </span>
                        » будет удален после сохранения курса
                    </p>
                    <Button
                        className="p-0 text-blue-500 dark:text-blue-500/80"
                        type="button"
                        onClick={() => {
                            setDeletedIds((prev) =>
                                prev.filter((delId) => delId !== fakeId),
                            );
                        }}
                        variant={"link"}
                    >
                        Восстановить
                    </Button>
                </div>
            ) : (
                <div>
                    <div className="relative flex items-center gap-4 p-5 border border-l-4 bg-bg-2">
                        <span className="text-3xl font-medium">{i + 1}</span>
                        <Controller
                            name={`modules.${i}.title`}
                            render={({ fieldState }) => {
                                const errorMsg = fieldState.error?.message;
                                return (
                                    <div className="w-full relative">
                                        <Input
                                            defaultValue={title}
                                            className={cn(
                                                "text-xl",
                                                errorMsg &&
                                                    "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-200",
                                            )}
                                            {...form.register(
                                                `modules.${i}.title`,
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
                        <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => {
                                if (fakeId !== -1) {
                                    setDeletedIds((prev) => [...prev, fakeId]);
                                } else {
                                    remove(i);
                                }
                            }}
                        >
                            <Trash2 />
                        </Button>

                        {fields.length > 1 && (
                            <div className="absolute -right-7 flex flex-col justify-center h-[84px]">
                                {i > 0 && (
                                    <MoveUp moveFn={() => move(i, i - 1)} />
                                )}
                                {i < fields.length - 1 && (
                                    <MoveDown moveFn={() => move(i, i + 1)} />
                                )}
                            </div>
                        )}
                    </div>
                    <Themes
                        courseId={courseId}
                        deletedIds={deletedThemeIds}
                        setDeletedIds={setDeletedThemeIds}
                        index={i}
                        form={form}
                    />
                </div>
            )}
        </div>
    );
}
