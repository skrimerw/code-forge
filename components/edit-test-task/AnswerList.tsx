import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { EditTestTaskType } from "@/lib/schemas/test-task";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import AnswerCard from "./AnswerCard";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface Props {
    activeIndex: number;
    className?: string;
}

export default function AnswerList({ activeIndex, className }: Props) {
    const form = useFormContext<EditTestTaskType>();
    const { append, move } = useFieldArray({
        name: `body.${activeIndex}.answers`,
        control: form.control,
        keyName: "id",
    });

    const activeQuestion = form.watch(`body.${activeIndex}`);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className={className}>
            {mounted ? (
                <DragDropContext
                    onDragEnd={(args) => {
                        if (!args.destination) return;

                        move(args.source.index, args.destination.index);
                    }}
                >
                    <Droppable droppableId={`answers-${activeIndex}`}>
                        {(provided) => {
                            return (
                                <div
                                    className="flex flex-col"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {activeQuestion.answers.map(({ id }, i) => {
                                        return (
                                            <Draggable
                                                key={id}
                                                draggableId={`answer-${id}`}
                                                index={i}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="my-1"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <AnswerCard
                                                            activeIndex={
                                                                activeIndex
                                                            }
                                                            id={id}
                                                            index={i}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            );
                        }}
                    </Droppable>
                </DragDropContext>
            ) : (
                <div className="flex flex-col">
                    {activeQuestion.answers.map(({ id }, i) => {
                        return (
                            <div key={id} className="my-1">
                                <AnswerCard
                                    activeIndex={activeIndex}
                                    id={id}
                                    index={i}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <Button
                type="button"
                variant={"outline"}
                className="mt-4"
                onClick={() => {
                    if (activeQuestion.answers.length === 15) {
                        toast.warning(
                            "Можно добавить не более 15 вариантов ответа",
                        );
                        return;
                    }
                    append({
                        id: Math.random(),
                        label: "",
                    });
                    requestAnimationFrame(() => {
                        window.scrollBy({
                            top: 77.5,
                        });
                    });
                }}
            >
                <Plus /> Добавить вариант ответа
            </Button>
        </div>
    );
}
