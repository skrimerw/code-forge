import React, { useMemo } from "react";
import { Button } from "../ui/button";
import StepProgressbar from "./StepProgressbar";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";
import Question from "./Question";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  function prevStep() {
    setStep(step - 1);
  }

  return (
    <div
      className={cn(
        "shadow-lg rounded-xl bg-white p-5 max-w-4xl mx-auto transition-[height] duration-300",
        className
      )}
    >
      <StepProgressbar className="mb-4" />
      <div className="grid ">
        {testBody.map(({}, i) => {
          return (
            <Question
              questionNumber={i + 1}
              className={cn(
                "mb-8 col-start-1 col-end-2 row-start-1 row-end-2 opacity-0 transition-opacity duration-300 invisible pointer-events-none",
                step === i + 1 && "opacity-100 visible pointer-events-auto"
              )}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        {step > 1 && (
          <Button onClick={prevStep}>
            <ChevronLeft /> Назад
          </Button>
        )}
        {step !== totalSteps ? (
          <Button onClick={nextStep} disabled={!isAnswersChosen}>
            Далее <ChevronRight />
          </Button>
        ) : (
          <Button className="ml-auto" disabled={!isAnswersChosen}>
            Завершить
          </Button>
        )}
      </div>
    </div>
  );
}
