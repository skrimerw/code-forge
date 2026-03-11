import React from "react";
import SingularQuestion from "./SingularQuestion";
import MultipleQuestion from "./MultipleQuestion";
import { useTestTask } from "./context/useTestTask";

interface Props {
  className?: string;
}

export default function Question() {
  const { step, testBody } = useTestTask();

  const { type, title } = testBody[step - 1];

  return type === "singular" ? (
    <SingularQuestion title={title} />
  ) : (
    <MultipleQuestion title={title} />
  );
}
