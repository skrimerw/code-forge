import React from "react";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useTestTask } from "./context/useTestTask";

interface Props {
  title: string;
  className?: string;
}

export default function SingularQuestion({ title }: Props) {
  const { setUserAnswers, userAnswers, testBody, step } = useTestTask();
  const { id: questionId, answers } = testBody[step - 1];

  return (
    <div>
      <h2 className="font-medium mb-1">{title}</h2>
      <RadioGroup
        className="gap-2"
        onValueChange={(value) =>
          setUserAnswers({
            ...userAnswers,
            [questionId]: Number(value),
          })
        }
      >
        {answers.map(({ id, label }) => {
          return (
            <div key={id} className="flex gap-2 items-center">
              <RadioGroupItem value={String(id)} id={`answer-${id}`} />
              <Label htmlFor={`answer-${id}`} className="font-normal">
                {label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
