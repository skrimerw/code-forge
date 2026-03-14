import React from "react";
import SingularQuestion from "./SingularQuestion";
import MultipleQuestion from "./MultipleQuestion";
import { useTestTask } from "./context/useTestTask";

interface Props {
  questionNumber: number;
  className?: string;
}

export default function Question({ questionNumber, className }: Props) {
  const { testBody } = useTestTask();

  const { type, title } = testBody[questionNumber - 1];

  return (
    <div className={className}>
      {type === "singular" ? (
        <SingularQuestion title={title} />
      ) : (
        <MultipleQuestion title={title} />
      )}
    </div>
  );
}
