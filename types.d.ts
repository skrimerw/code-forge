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
    stack: string;
}

export type TestStatus = "passed" | "failed";
