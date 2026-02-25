import { OnMount } from "@monaco-editor/react";
import { createContext, RefObject, useContext, useRef, useState } from "react";

type IStandaloneCodeEditor = Parameters<OnMount>[0];

interface CodeEditorContextValue {
    lang: Language;
    output: Output | null;
    editorRef: RefObject<IStandaloneCodeEditor | null>;
    setLang: (lang: Language) => void;
    setOutput: (output: Output | null) => void;
}

const CodeEditorContext = createContext<CodeEditorContextValue | null>(null);

export default function CodeEditorProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lang, setLang] = useState<Language>("javascript");
    const [output, setOutput] = useState<Output | null>(null);
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
