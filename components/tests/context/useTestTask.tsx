import { TestBody, UserAnswers } from "@/lib/mock-test";
import { createContext, useContext, useState } from "react";

type Result = {
    score: number;
} | null;

interface TestTaskValue {
    testId: number;
    step: number;
    setStep: (val: number) => void;
    userAnswers: UserAnswers;
    setUserAnswers: (val: UserAnswers) => void;
    totalSteps: number;
    testBody: TestBody;
    result: Result;
    setResult: (val: Result) => void;
    loadingResult: boolean;
    setLoadingResult: (val: boolean) => void;
    resetTest: () => void;
}

const TestTaskContext = createContext<TestTaskValue | null>(null);

export function TestTaskProvider({
    children,
    testId,
    testBody,
}: {
    children: React.ReactNode;
    testId: number;
    testBody: TestBody;
}) {
    const [step, setStep] = useState(1);
    const [result, setResult] = useState<Result>(null);
    const [loadingResult, setLoadingResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const totalSteps = testBody.length;

    function resetTest() {
        setStep(1);
        setResult(null);
        setUserAnswers({});
    }

    return (
        <TestTaskContext.Provider
            value={{
                testId,
                step,
                setStep,
                userAnswers,
                setUserAnswers,
                totalSteps,
                testBody,
                result,
                setResult,
                loadingResult,
                setLoadingResult,
                resetTest,
            }}
        >
            {children}
        </TestTaskContext.Provider>
    );
}

export function useTestTask() {
    const ctx = useContext(TestTaskContext);

    if (!ctx) {
        throw new Error("useTestTask must be used within TestTaskProvider");
    }

    return ctx;
}
