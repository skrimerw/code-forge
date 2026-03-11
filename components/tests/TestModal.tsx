"use client";

import React from "react";
import { TestBody } from "@/lib/mock-test";

import { TestTaskProvider } from "./context/useTestTask";
import TestContent from "./TestContent";

interface Props {
  testBody: TestBody;
}

export default function TestModal({ testBody }: Props) {
  return (
    <TestTaskProvider testBody={testBody}>
      <TestContent />
    </TestTaskProvider>
  );
}
