import React from "react";
import { useTestTask } from "./context/useTestTask";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { UserAnswers } from "@/lib/mock-test";

interface Props {
  title: string;
  className?: string;
}

export default function MultipleQuestion({ title }: Props) {
  const { setUserAnswers, userAnswers, testBody, step } = useTestTask();
  const { id: questionId, answers } = testBody[step - 1];

  function onCheckboxChange(checked: boolean | "indeterminate", id: number) {
    const currentAnswers =
      userAnswers[questionId] === undefined ? [] : userAnswers[questionId];

    if (currentAnswers instanceof Array) {
      if (checked) {
        setUserAnswers({
          ...userAnswers,
          [questionId]: [...currentAnswers, id],
        });
      } else {
        const filtered = currentAnswers.filter((ans) => ans !== id);
        if (filtered.length) {
          setUserAnswers({
            ...userAnswers,
            [questionId]: filtered,
          });
        } else {
          const newAnswersObj: UserAnswers = {};

          for (const key in userAnswers) {
            if (key === String(questionId)) {
              continue;
            }

            newAnswersObj[key] = userAnswers[key];
          }

          setUserAnswers(newAnswersObj);
        }
      }
    }
  }

  function getDefaultValue(id: number) {
    const userAnswer = userAnswers[String(questionId)];

    if (userAnswer instanceof Array) {
      return userAnswer.includes(id);
    }

    return undefined;
  }

  return (
    <div>
      <h2 className="font-medium mb-1">{title}</h2>
      <div className="flex flex-col gap-2">
        {answers.map(({ id, label }) => {
          return (
            <Label
              key={id}
              htmlFor={`checkbox-${id}`}
              className="font-normal p-4 rounded-md border border-border transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-gray-100"
            >
              <Checkbox
                id={`checkbox-${id}`}
                defaultChecked={getDefaultValue(id)}
                onCheckedChange={(checked) => onCheckboxChange(checked, id)}
              />
              {label}
            </Label>
          );
        })}
      </div>
    </div>
  );
}
