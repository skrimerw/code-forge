"use client";

import { RatingData, useRating } from "@/contexts/useRating";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

interface Props {
    initialRating: number;
    courseId: number;
    className?: string;
}

export default function RatingPicker({
    initialRating,
    courseId,
    className,
}: Props) {
    const [rating, setRating] = useState(initialRating);
    const [changing, setChanging] = useState(false);
    const [hoverNum, setHoverNum] = useState<null | number>(null);
    const { setRating: setTotalRating } = useRating();
    const session = useSession();

    function getRatingBadgeColor() {
        let colorStr = "";

        if (rating > 3) {
            colorStr = "bg-green-700";
        } else if (rating > 2) {
            colorStr = "bg-yellow-500 dark:bg-yellow-500/70";
        } else {
            colorStr = "bg-red-700";
        }

        return colorStr;
    }

    async function sendRatingRequest(rating: number) {
        try {
            const { data } = await axios.post<RatingData>(
                `/api/courses/${courseId}/rating`,
                {
                    rating,
                    userId: session.data?.user.id,
                },
            );

            setTotalRating(data);
        } catch (e) {
            console.log(e);
        }
    }

    async function handleStarClick(i: number) {
        setRating(i + 1);

        if (changing) {
            setChanging(false);
        }

        await sendRatingRequest(i + 1);
    }

    return (
        <div className={cn("h-[60px]", className)}>
            {changing || rating === 0 ? (
                <div>
                    <h4 className="font-medium sm:font-bold sm:mt-1 text-center sm:text-end">
                        Оценить курс
                    </h4>
                    <div className="flex items-center rounded-full px-2 py-0.5 bg-gray-200 dark:bg-bg-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                            return (
                                <div
                                    key={i}
                                    className="p-1 size-[26px] cursor-pointer hover:scale-120 transition-transform focus:scale-100"
                                    onMouseOver={() => setHoverNum(i)}
                                    onMouseLeave={() => setHoverNum(null)}
                                    onClick={() => handleStarClick(i)}
                                >
                                    <Star
                                        strokeWidth={1.5}
                                        size={18}
                                        className={cn(
                                            "stroke-typography-secondary transition-none cursor-pointer",
                                            (typeof hoverNum === "number"
                                                ? i <= hoverNum
                                                : rating >= i + 1) &&
                                                "stroke-yellow-500 fill-yellow-500 dark:stroke-yellow-600 dark:fill-yellow-600",
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setChanging(true)}
                    className="flex items-center gap-6 rounded-full px-2 pl-5 py-1.5 bg-gray-200 dark:bg-bg-2 hover:bg-gray-300 dark:hover:bg-white/10"
                >
                    <span className="font-bold text-sm cursor-default text-nowrap">
                        Изменить оценку
                    </span>
                    <div
                        className={cn(
                            "flex items-center text-sm gap-0.5 rounded-full text-white bg-green-700 px-2",
                            getRatingBadgeColor(),
                        )}
                    >
                        <Star size={12} className="fill-white stroke-white" />
                        <span className="cursor-default">{rating}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
