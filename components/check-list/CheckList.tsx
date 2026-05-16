"use client";

import {
    PodachaCheckList,
    runCheckList,
    StructureCheckList,
} from "@/actions/runCheckList";
import CheckOption from "@/components/check-list/CheckOption";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCourseData } from "@/contexts/useCourseData";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2, RotateCw } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    courseId: number;
    initialPodacha: PodachaCheckList;
    initialStructure: StructureCheckList;
    className?: string;
}

export default function CheckList({
    courseId,
    initialPodacha,
    initialStructure,
    className,
}: Props) {
    const [loadingChecklist, setLoadingChecklist] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [unpublishing, setUnpublishing] = useState(false);
    const [checkOptionsPodacha, setCheckOptionsPodacha] =
        useState(initialPodacha);
    const [checkOptionsStructure, setCheckOptionsStructure] =
        useState(initialStructure);
    const { setCourse, course } = useCourseData();

    const { podachaKeys, podachaValues, structureKeys, structureValues } =
        useMemo(() => {
            const podachaKeys = Object.keys(checkOptionsPodacha);
            const structureKeys = Object.keys(checkOptionsStructure);
            const podachaValues = Object.values(checkOptionsPodacha);
            const structureValues = Object.values(checkOptionsStructure);

            return {
                podachaKeys,
                structureKeys,
                podachaValues,
                structureValues,
            };
        }, [checkOptionsPodacha, checkOptionsStructure]);

    const totalOptionsCount = podachaKeys.length + structureKeys.length;
    const validOptionsCount = useMemo(() => {
        return (
            podachaValues.filter((option) => option.isValid).length +
            structureValues.filter((option) => option.isValid).length
        );
    }, [checkOptionsPodacha, checkOptionsStructure]);

    async function recount() {
        try {
            setLoadingChecklist(true);
            const { checkOptionsPodacha, checkOptionsStructure } =
                await runCheckList(courseId);

            setCheckOptionsPodacha(checkOptionsPodacha);
            setCheckOptionsStructure(checkOptionsStructure);
        } catch (e) {
            console.log(e);
            toast.error("Ошибка! Попробуйте еще раз");
        } finally {
            setLoadingChecklist(false);
        }
    }

    async function publish() {
        try {
            setPublishing(true);
            const { data } = await axios.post(
                `/api/courses/${courseId}/publish`,
            );

            setCourse(data);

            toast.success("Курс опубликован");
        } catch (e) {
            console.log(e);
            toast.error("Ошибка при публикации");
        } finally {
            setPublishing(false);
        }
    }

    async function unpublish() {
        try {
            setUnpublishing(true);
            const { data } = await axios.post(
                `/api/courses/${course.id}/unpublish`,
            );

            setCourse(data);

            toast.success("Курс снят с публикации");
        } catch (e) {
            console.log(e);
            toast.error("Ошибка при снятии с публикации");
        } finally {
            setUnpublishing(false);
        }
    }

    return (
        <div className={className}>
            <div className="flex items-center gap-2 mb-1">
                <h2 className="font-medium text-lg">
                    Курс готов на {validOptionsCount}/{totalOptionsCount}
                </h2>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            disabled={loadingChecklist}
                            onClick={recount}
                            variant={"ghost"}
                            className="size-7 p-0 hover:bg-black/6 dark:hover:bg-white/6 text-foreground/50 hover:text-foreground"
                        >
                            <RotateCw
                                strokeWidth={2.7}
                                className={cn(
                                    "size-3.5!",
                                    loadingChecklist && "animate-spin",
                                )}
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Пересчитать</TooltipContent>
                </Tooltip>
            </div>
            <div className="space-y-7 max-w-3xl">
                <div>
                    <h2 className="font-medium text-lg mb-1.5">
                        Структура и содержание
                    </h2>
                    <div className="flex flex-col gap-4">
                        {structureValues.map(
                            (
                                {
                                    description,
                                    isValid,
                                    link,
                                    linkLabel,
                                    title,
                                },
                                i,
                            ) => {
                                return (
                                    <CheckOption
                                        key={i}
                                        title={title}
                                        description={description}
                                        isValid={isValid}
                                        link={link}
                                        linkLabel={linkLabel}
                                    />
                                );
                            },
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="font-medium text-lg mb-1.5">Подача</h2>
                    <div className="flex flex-col gap-4">
                        {podachaValues.map(
                            (
                                {
                                    description,
                                    isValid,
                                    link,
                                    linkLabel,
                                    title,
                                },
                                i,
                            ) => {
                                return (
                                    <CheckOption
                                        key={i}
                                        title={title}
                                        description={description}
                                        isValid={isValid}
                                        link={link}
                                        linkLabel={linkLabel}
                                    />
                                );
                            },
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <Button
                    className="gap-0 mt-10 px-8"
                    onClick={publish}
                    disabled={
                        publishing ||
                        loadingChecklist ||
                        validOptionsCount !== totalOptionsCount ||
                        course.status === "PUBLISHED"
                    }
                >
                    <div className="relative">
                        <span
                            className={cn(
                                "absolute opacity-0 -left-2.5 top-1/2 -translate-y-1/2 invisible transition-opacity duration-300",
                                publishing && "opacity-100 visible",
                            )}
                        >
                            <Loader2 className="animate-spin" />
                        </span>
                    </div>
                    <span
                        className={cn(
                            "transition-transform duration-300",
                            publishing && "translate-x-4",
                        )}
                    >
                        Опубликовать
                    </span>
                </Button>
                {course.status === "PUBLISHED" && (
                    <Button
                        variant={"destructive"}
                        className="gap-0 mt-10 px-8 bg-red-500 hover:red-700"
                        onClick={unpublish}
                        disabled={
                            unpublishing ||
                            loadingChecklist ||
                            validOptionsCount !== totalOptionsCount
                        }
                    >
                        <div className="relative">
                            <span
                                className={cn(
                                    "absolute opacity-0 -left-2.5 top-1/2 -translate-y-1/2 invisible transition-opacity duration-300",
                                    unpublishing && "opacity-100 visible",
                                )}
                            >
                                <Loader2 className="animate-spin" />
                            </span>
                        </div>
                        <span
                            className={cn(
                                "transition-transform duration-300",
                                unpublishing && "translate-x-4",
                            )}
                        >
                            Снять с публикации
                        </span>
                    </Button>
                )}
            </div>
        </div>
    );
}
