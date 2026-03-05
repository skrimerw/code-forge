import { TestSuite } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
