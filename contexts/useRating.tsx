"use client";

import { createContext, SetStateAction, useContext, useState } from "react";

export type RatingData = {
    rating: number;
    reviewsCount: number;
};

interface RatingContextValue {
    rating: RatingData;
    setRating: (val: SetStateAction<RatingData>) => void;
}

const RatingContext = createContext<RatingContextValue | null>(null);

export function RatingProvider({
    initialRating,
    children,
}: {
    initialRating: RatingData;
    children: React.ReactNode;
}) {
    const [rating, setRating] = useState<RatingData>(initialRating);

    return (
        <RatingContext.Provider value={{ rating, setRating }}>
            {children}
        </RatingContext.Provider>
    );
}

export function useRating() {
    const ctx = useContext(RatingContext);

    if (!ctx) {
        throw new Error("useRating must be used within RatingProvider");
    }

    return ctx;
}
