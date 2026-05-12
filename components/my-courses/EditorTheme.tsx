import { Draggable } from "@hello-pangea/dnd";
import React, { SetStateAction } from "react";
import { Button } from "../ui/button";
import { GripVertical, X } from "lucide-react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import MoveUp from "./MoveUp";
import MoveDown from "./MoveDown";
import { ContentSchemaType } from "@/lib/schemas/course-content";
import Link from "next/link";
import CourseCover from "../icons/CourseCover";

interface Props {
    fields: any;
    move: (i: number, j: number) => void;
    remove: (i: number) => void;
    themeId: string;
    fakeId: number;
    index: number;
    indexJ: number;
    imageUrl: string;
    courseId: number;
    form: UseFormReturn<ContentSchemaType>;
    deletedIds: number[];
    setDeletedIds: (val: SetStateAction<number[]>) => void;
    className?: string;
}

export default function EditorTheme({
    fields,
    move,
    remove,
    courseId,
    deletedIds,
    fakeId,
    form,
    index,
    indexJ: j,
    themeId,
    setDeletedIds,
    imageUrl,
    className,
}: Props) {
    return (
        <Draggable
            key={themeId}
            draggableId={String(themeId)}
            index={j}
            isDragDisabled={deletedIds.includes(fakeId)}
        >
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging
                                ? "0 0px 10px 0 rgba(0,0,0,0.1)"
                                : "",
                        }}
                        className={className}
                    >
                        {deletedIds.includes(fakeId) ? (
                            <div className="flex justify-between px-5 py-3">
                                <p className="text-primary/50 dark:text-white/60">
                                    Тема «
                                    <span className="font-bold">
                                        {form.getValues(
                                            `modules.${index}.themes.${j}.title`,
                                        )}
                                    </span>
                                    » будет удалена из курса при сохранении
                                </p>
                                <Button
                                    className="p-0 text-blue-500 dark:text-blue-500/80"
                                    type="button"
                                    onClick={() => {
                                        setDeletedIds((prev) =>
                                            prev.filter((id) => id !== fakeId),
                                        );
                                    }}
                                    variant={"link"}
                                >
                                    Восстановить
                                </Button>
                            </div>
                        ) : (
                            <div className="relative group flex items-center gap-2 px-5 py-2.5 bg-bg-2 transition-shadow">
                                <Button
                                    {...provided.dragHandleProps}
                                    variant={"ghost"}
                                    className="p-0 size-7! text-primary/50 dark:text-white/50 cursor-grab active:cursor-grabbing"
                                    asChild
                                >
                                    <span>
                                        <GripVertical />
                                    </span>
                                </Button>
                                <div className="flex items-center gap-5 w-full">
                                    <div className="flex items-center flex-none size-16 overflow-hidden object-cover">
                                        {imageUrl ? (
                                            <img
                                                className="object-cover size-full"
                                                src={imageUrl}
                                                alt="Preview"
                                            />
                                        ) : (
                                            <CourseCover />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 w-full">
                                        <span className="text-black/40 dark:text-white/40 text-sm font-mono">
                                            {index + 1}.{j + 1}
                                        </span>
                                        <Controller
                                            name={`modules.${index}.themes.${j}.title`}
                                            render={({ fieldState }) => {
                                                const errorMsg =
                                                    fieldState.error?.message;
                                                return (
                                                    <div className="w-full relative">
                                                        <Input
                                                            className={cn(
                                                                "text-lg w-full border-0 shadow-none bg-transparent hover:bg-black/3 focus-visible:bg-black/3 focus-visible:ring-1 focus-visible:ring-black/30",
                                                                errorMsg &&
                                                                    "focus-visible:ring-red-600",
                                                            )}
                                                            {...form.register(
                                                                `modules.${index}.themes.${j}.title`,
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
                                        {fields.length > 1 && (
                                            <div className="absolute -right-[28px] flex flex-col justify-center">
                                                {j > 0 && (
                                                    <MoveUp
                                                        className="text-primary/50 dark:text-white/50 p-0 size-7! opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-[0ms]"
                                                        moveFn={() => {
                                                            move(j, j - 1);
                                                        }}
                                                    />
                                                )}
                                                {j < fields.length - 1 && (
                                                    <MoveDown
                                                        className="text-primary/50 dark:text-white/50 p-0 size-7! opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-[0ms]"
                                                        moveFn={() =>
                                                            move(j, j + 1)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {fakeId !== -1 && (
                                    <Button
                                        type="button"
                                        variant={"secondary"}
                                        asChild
                                    >
                                        <Link
                                            href={`/edit-lessons/${courseId}/themes/${fakeId}`}
                                        >
                                            Редактировать
                                        </Link>
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    className="h-fit"
                                    variant={"ghost"}
                                    onClick={() => {
                                        if (fakeId !== -1) {
                                            setDeletedIds((prev) => [
                                                ...prev,
                                                fakeId,
                                            ]);
                                        } else {
                                            remove(j);
                                        }
                                    }}
                                >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </div>
                );
            }}
        </Draggable>
    );
}
