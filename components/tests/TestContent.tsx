import React, { useMemo } from "react";
import { Button } from "../ui/button";
import StepProgressbar from "./StepProgressbar";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";
import Question from "./Question";

interface Props {
  className?: string;
}

export default function TestContent({ className }: Props) {
  const { userAnswers, step, setStep, testBody } = useTestTask();

  const totalSteps = testBody.length;
  const { id: questionId } = testBody[step - 1];

  const isAnswersChosen = useMemo(() => {
    return Object.keys(userAnswers).includes(String(questionId));
  }, [userAnswers, step]);

  function nextStep() {
    setStep(step + 1);
  }

  return (
    <div
      className={cn(
        "shadow-lg rounded-xl bg-white p-5 max-w-4xl mx-auto",
        className
      )}
    >
      <StepProgressbar />
      <Question />
      {step !== totalSteps ? (
        <Button onClick={nextStep} disabled={!isAnswersChosen}>
          Next &gt;
        </Button>
      ) : (
        <Button disabled={!isAnswersChosen}>Finish</Button>
      )}
    </div>
  );
}
