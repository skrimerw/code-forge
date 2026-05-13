import { TestSuite } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question } from "./mock-test";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function hasTestsPassed(testSuites: TestSuite[]) {
    if (typeof testSuites !== "object") return false;

    if (!testSuites.length) return true;

    for (const { tests, suites } of testSuites) {
        for (const { status } of tests) {
            if (status === "failed") return false;
        }

        if (!hasTestsPassed(suites)) {
            return false;
        }
    }

    return true;
}

export function getEmptyQuestion() {
    const rightAnswerId = Math.random();

    const emptyQuestion: Question = {
        id: Math.random(),
        title: "",
        type: "singular",
        actualAnswer: rightAnswerId,
        answers: [
            {
                id: rightAnswerId,
                label: "",
            },
            {
                id: Math.random(),
                label: "",
            },
            {
                id: Math.random(),
                label: "",
            },
            {
                id: Math.random(),
                label: "",
            },
        ],
    };

    return emptyQuestion;
}
