import Container from "@/components/Container";
import TestModal from "@/components/tests/TestModal";
import { testBodyMock, UserAnswers } from "@/lib/mock-test";
import React from "react";

export default function MockTestPage() {
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

  return (
    <Container className="py-16">
      <TestModal testBody={testBodyMock} />
    </Container>
  );
}
