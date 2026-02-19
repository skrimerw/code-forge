import { OnMount } from "@monaco-editor/react";
import { createContext, RefObject, useContext, useRef, useState } from "react";

type IStandaloneCodeEditor = Parameters<OnMount>[0];

interface CodeEditorContextValue {
    lang: Language;
    output: string;
    editorRef: RefObject<IStandaloneCodeEditor | null>;
    setLang: (lang: Language) => void;
    setOutput: (output: string) => void;
}

const CodeEditorContext = createContext<CodeEditorContextValue | null>(null);

export default function CodeEditorProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lang, setLang] = useState<Language>("javascript");
    const [output, setOutput] = useState("");
    const editorRef = useRef<IStandaloneCodeEditor>(null);

    return (
        <CodeEditorContext.Provider
            value={{ lang, output, editorRef, setLang, setOutput }}
        >
            {children}
        </CodeEditorContext.Provider>
    );
}

export function useCodeEditor() {
    const context = useContext(CodeEditorContext);

    if (!context)
        throw new Error("useCodeEditor must be used within CodeEditorProvider");

    return context;
}
