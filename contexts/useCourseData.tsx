"use client";

import { Course } from "@prisma/client";
import { createContext, SetStateAction, useContext, useState } from "react";

interface CourseDataContextValue {
    course: Course;
    setCourse: (val: SetStateAction<Course>) => void;
}

const CourseDataContext = createContext<CourseDataContextValue | null>(null);

export function CourseDataProvider({
    initialData,
    children,
}: {
    initialData: Course;
    children: React.ReactNode;
}) {
    const [course, setCourse] = useState<Course>(initialData);

    return (
        <CourseDataContext.Provider value={{ course, setCourse }}>
            {children}
        </CourseDataContext.Provider>
    );
}

export function useCourseData() {
    const ctx = useContext(CourseDataContext);

    if (!ctx) {
        throw new Error("useCourseData must be used within CourseDataProvider");
    }

    return ctx;
}
