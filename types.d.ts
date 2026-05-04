import { Language } from "@prisma/client";

export interface Output {
    stdout: string;
    stderr: string;
    code: number;
    time: number;
    timedOut: boolean;
}

export interface QueueSandboxJob {
    id: number;
    lang: Language;
    code: string;
}

export interface QueueCodeTaskJob extends QueueSandboxJob {
    test: string;
}

export interface OutputWithTests extends Output, TestRunResult {}

export interface TestRunResult {
    stdout: string;
    stderr: string;
    tests: TestSuite[];
}

export interface TestSuite {
    title: string;
    suites: TestSuite[];
    tests: TestCase[];
}

export interface TestCase {
    title: string;
    logs: string[];
    status: TestStatus;
    err: TestError | null;
    duration: number;
}

export interface TestError {
    message: string;
    actual: number;
    expected: number;
    showDiff: boolean;
    operator: string;
    name: string;
    ok: boolean;
    stack: string;
}

export type TestStatus = "passed" | "failed";

export type LangObj = {
    label: string;
    value: Language;
};

export type Period = "week" | "month" | "year" | "all";

export type RangeData = Record<string, number>;

export type ActivityData = {
    week: RangeData;
    month: RangeData;
    year: RangeData;
    all: RangeData;
};

export interface ActivityData2 {
    week: { date: string; count: number }[];
    month: { date: string; count: number }[];
    year: { date: string; count: number }[];
    all: { date: string; count: number }[];
}
