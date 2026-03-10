"use client";

import { useCodeEditor } from "@/contexts/useCodeEditor";
import { Language } from "@prisma/client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { availableLanguages } from "./constants";

export default function SandboxLocalStorageHandler() {
  const { editorRef, lang, setLang } = useCodeEditor();
  const pathname = usePathname();

  useEffect(() => {
    const lang = window.localStorage.getItem("sandbox.lang");

    if (lang !== undefined) {
      const allLangs = availableLanguages.map(({ value }) => value);

      if (!allLangs.includes(lang?.toUpperCase() as Language)) {
        setLang(availableLanguages[0].value);
      } else {
        setLang(lang as Language);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const editor = editorRef.current;

      if (editor) {
        const value = editor.getValue();

        window.localStorage.setItem("sandbox.code", value);

        if (pathname === "/sandbox")
          window.localStorage.setItem("sandbox.lang", lang);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [lang, editorRef, pathname]);

  return <></>;
}
