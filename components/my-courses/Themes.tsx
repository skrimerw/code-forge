"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { ContentSchemaType } from "@/lib/schemas/course-content";
import EditorTheme from "./EditorTheme";
import CourseCover from "../icons/CourseCover";

interface Props {
    courseId: number;
    deletedIds: number[];
    setDeletedIds: (val: SetStateAction<number[]>) => void;
    index: number;
    form: UseFormReturn<ContentSchemaType>;
    className?: string;
}

export default function Themes({
    courseId,
    deletedIds,
    setDeletedIds,
    index,
    form,
    className,
}: Props) {
    const [newTheme, setNewTheme] = useState("");
    const [show, setShow] = useState(true);

    const { fields, append, move, remove } = useFieldArray({
        name: `modules.${index}.themes`,
        control: form.control,
    });

    function appendNewTheme() {
        append(
            {
                id: -1,
                fakeId: -1,
                title: newTheme,
                imageUrl: "",
            },
            {
                shouldFocus: false,
            },
        );

        setNewTheme("");
    }

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 0);
    }, []);

    return (
        <>
            {show && (
                <div
                    className={cn(
                        "border ml-5 sm:ml-10 py-2 border-t-0 bg-bg-2",
                        className,
                    )}
                >
                    <DragDropContext
                        onDragEnd={(args) => {
                            if (!args.destination) return;

                            move(args.source.index, args.destination.index);
                        }}
                    >
                        <Droppable droppableId="themes">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {fields.map(
                                        (
                                            { id: themeId, imageUrl, fakeId },
                                            j,
                                        ) => {
                                            return (
                                                <EditorTheme
                                                    fields={fields}
                                                    move={move}
                                                    remove={remove}
                                                    courseId={courseId}
                                                    key={themeId}
                                                    themeId={themeId}
                                                    form={form}
                                                    imageUrl={imageUrl}
                                                    index={index}
                                                    indexJ={j}
                                                    fakeId={fakeId}
                                                    deletedIds={deletedIds}
                                                    setDeletedIds={
                                                        setDeletedIds
                                                    }
                                                />
                                            );
                                        },
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <div className="flex gap-2 sm:gap-5 px-3 sm:px-5 py-1 sm:py-2.5">
                        <div className="size-12 sm:size-16 overflow-hidden object-cover flex-none">
                            <CourseCover className="size-full" />
                        </div>
                        <Input
                            value={newTheme}
                            className="h-9 sm:h-fit"
                            onChange={(e) => setNewTheme(e.target.value)}
                            placeholder="Введите название новой темы и нажмите Enter"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.stopPropagation();

                                    if (newTheme.length > 0) {
                                        appendNewTheme();
                                    }
                                }
                            }}
                        />
                        <Button
                            className="size-9 sm:size-fit"
                            type="button"
                            onClick={appendNewTheme}
                            disabled={newTheme.length === 0}
                        >
                            <PlusCircle />
                            <span className="hidden sm:inline">
                                Создать тему
                            </span>
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
