"use client";

import React from "react";
import { TestBody } from "@/lib/mock-test";

import { TestTaskProvider } from "./context/useTestTask";
import TestContent from "./TestContent";

interface Props {
    testId: number;
    testBody: TestBody;
}

export default function TestModal({ testId, testBody }: Props) {
    return (
        <TestTaskProvider testId={testId} testBody={testBody}>
            <TestContent />
        </TestTaskProvider>
    );
}
