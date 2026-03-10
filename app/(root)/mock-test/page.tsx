"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { testBodyMock, UserAnswers } from "@/lib/mock-test";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function MockTestPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = useForm<UserAnswers>({
    defaultValues: {},
  });

  function getUserScore(answers: UserAnswers) {
    let userScore = 0;

    for (const key in answers) {
      const answer = answers[key];
      const actualAnswer = testBodyMock.find(
        ({ id }) => id === Number(key)
      )?.actualAnswer;

      if (answer instanceof Array) {
        const answerSet = new Set(answer);
        const actualAnswerSet = new Set(
          actualAnswer === undefined || null ? [] : (actualAnswer as number[])
        );

        const rightAnswersAmount = answerSet.intersection(actualAnswerSet).size;

        if (rightAnswersAmount) {
          userScore += rightAnswersAmount / actualAnswerSet.size;
        }
      } else if (typeof answer === "number") {
        if (actualAnswer === answer) {
          userScore++;
        }
      } else {
        console.error("Invalid type of answer");
      }
    }

    return userScore;
  }

  function validateForm(answers: UserAnswers): boolean {
    let isValid = true;

    for (const key in answers) {
      const answer = answers[key];

      if (answer instanceof Array) {
        if (answer.length === 0) {
          setErrors((prev) => ({
            ...prev,
            [key]: "Выберите хотя бы один вариант ответа",
          }));

          isValid = false;
        }
      }
    }

    return isValid;
  }

  function onSubmit(data: UserAnswers) {
    if (validateForm(data)) {
      const score = getUserScore(data);

      console.log(score);
    }
  }

  return (
    <Container className="py-16">
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {testBodyMock.map(({ id: questionId, answers, type, title }) => {
            if (type === "singular") {
              form.setValue(`${questionId}`, -1);

              return (
                <div key={questionId}>
                  <h2 className="font-medium mb-1">{title}</h2>
                  <RadioGroup
                    className="gap-2"
                    onValueChange={(value) =>
                      form.setValue(`${questionId}`, Number(value))
                    }
                  >
                    {answers.map(({ id, label }) => {
                      return (
                        <div key={id} className="flex gap-2 items-center">
                          <RadioGroupItem
                            value={String(id)}
                            id={`answer-${id}`}
                          />
                          <Label
                            htmlFor={`answer-${id}`}
                            className="font-normal"
                          >
                            {label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {errors[String(questionId)]}
                </div>
              );
            } else {
              const fieldName = `${questionId}`;

              if (!form.getValues(fieldName)) {
                form.setValue(fieldName, []);
              }

              return (
                <div key={questionId}>
                  <h2 className="font-medium mb-1">{title}</h2>
                  <div className="flex flex-col gap-2">
                    {answers.map(({ id, label }) => {
                      return (
                        <div key={id} className="flex gap-2 items-center">
                          <Checkbox
                            id={`checkbox-${id}`}
                            checked={(
                              form.watch(fieldName) as number[]
                            )?.includes(id)}
                            onCheckedChange={(checked) => {
                              const currentValues =
                                (form.getValues(fieldName) as number[]) || [];
                              if (checked) {
                                form.setValue(fieldName, [
                                  ...currentValues,
                                  id,
                                ]);

                                setErrors((prev) => ({
                                  ...prev,
                                  [questionId]: null,
                                }));
                              } else {
                                form.setValue(
                                  fieldName,
                                  currentValues.filter((v) => v !== id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`checkbox-${id}`}
                            className="font-normal"
                          >
                            {label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  <span className="inline-block text-red-500 text-sm mt-2">
                    {errors[String(questionId)]}
                  </span>
                </div>
              );
            }
          })}
          <Button type="submit">Send Answers</Button>
        </form>
      </FormProvider>
    </Container>
  );
}
