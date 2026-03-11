import { TestBody, UserAnswers } from "@/lib/mock-test";
import { createContext, useContext, useState } from "react";

interface TestTaskValue {
  step: number;
  setStep: (val: number) => void;
  userAnswers: UserAnswers;
  setUserAnswers: (val: UserAnswers) => void;
  totalSteps: number;
  testBody: TestBody;
}

const TestTaskContext = createContext<TestTaskValue | null>(null);

export function TestTaskProvider({
  children,
  testBody,
}: {
  children: React.ReactNode;
  testBody: TestBody;
}) {
  const [step, setStep] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const totalSteps = testBody.length;

  return (
    <TestTaskContext.Provider
      value={{
        step,
        setStep,
        userAnswers,
        setUserAnswers,
        totalSteps,
        testBody,
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
