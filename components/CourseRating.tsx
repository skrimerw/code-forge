"use client";

import React, { useMemo } from "react";
import RatingPicker from "./RatingPicker";
import RatingStar from "./RatingStar";
import { useRating } from "@/contexts/useRating";
import { cn } from "@/lib/utils";

interface Props {
    userRating: number;
    courseId: number;
    className?: string;
}

export default function CourseRating({
    userRating,
    courseId,
    className,
}: Props) {
    const {
        rating: { rating, reviewsCount },
    } = useRating();

    function pluralizeOcenka(n: number) {
        const mod10 = n % 10;
        const mod100 = n % 100;

        if (n === 0) {
            return "Нет оценок";
        }

        if (mod10 === 1 && mod100 !== 11) {
            return `${n} оценка`;
        }
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
            return `${n} оценки`;
        }
        return `${n} оценок`;
    }

    const reviewsCountStr = pluralizeOcenka(reviewsCount);
    const formattedRating = useMemo(() => {
        return rating.toLocaleString("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });
    }, [rating]);

    return (
        <div className={cn("flex flex-col items-end", className)}>
            <div className="flex gap-2 sm:gap-2.5 items-center font-bold text-base sm:text-lg">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => {
                        return (
                            <RatingStar
                                key={i}
                                fillPercentage={
                                    i + 1 <= rating
                                        ? 100
                                        : (1 - (i + 1 - rating)) * 100
                                }
                            />
                        );
                    })}
                </div>
                {formattedRating}
            </div>
            <span className="text-typography-secondary text-sm">
                {reviewsCountStr}
            </span>

            <RatingPicker
                courseId={courseId}
                initialRating={userRating}
                className="mt-2 sm:mt-4"
            />
        </div>
    );
}
