"use client";

import CodeEditorProvider from "@/contexts/useCodeEditor";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import RunCodeBtn from "./RunCodeBtn";
import LanguageSelector from "./LanguageSelector";
import CodeEditor from "./CodeEditor";
import Output from "./task-info-tabs/Output";
import { availableLanguages } from "./constants";
import SandboxLocalStorageHandler from "./SandboxLocalStorageHandler";
import { SuccessModalProvider } from "@/contexts/useSuccessModal";

export default function SandboxWrapper() {
  const initialValue = useMemo(() => {
    if (typeof window !== "undefined") {
      const code = window.localStorage.getItem("sandbox.code");

      return code === null ? undefined : code;
    }

    return "";
  }, []);

  return (
    <SuccessModalProvider isSolvedInitial={true}>
      <CodeEditorProvider>
        <SandboxLocalStorageHandler />
        <div className={cn("flex gap-4 h-130")}>
          <Output className="max-w-sm w-full h-[calc(100%-56px)] mt-auto border-2 rounded-md overflow-hidden transition-colors bg-white dark:bg-bg-2" />

          <div className="flex flex-col gap-4 w-full">
            {/* Кнопки над редактором кода */}
            <div className="flex justify-between items-center">
              <RunCodeBtn apiEndpoint="/api/editor/run" />

              <LanguageSelector availableLangs={availableLanguages} />
            </div>

            {/* Редактор кода */}
            <div className="border-2 rounded-md bg-white dark:bg-bg-2 h-full w-full overflow-hidden">
              <CodeEditor initialValue={initialValue} />
            </div>
          </div>
        </div>
      </CodeEditorProvider>
    </SuccessModalProvider>
  );
}
