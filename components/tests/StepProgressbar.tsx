"use client";

import React from "react";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function StepProgressbar({ className }: Props) {
  const { step, totalSteps } = useTestTask();

  return (
    <p className={cn("", className)}>
      Question {step}/{totalSteps}
    </p>
  );
}
