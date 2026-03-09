import React, { useMemo } from "react";
import CodeEditor from "./CodeEditor";
import { Prisma } from "@prisma/client";
import { useCodeEditor } from "@/contexts/useCodeEditor";

interface Props {
    variants: Prisma.CodeTaskVariantGetPayload<{
        include: { codeTaskSolutions: true };
    }>[];
    className?: string;
}

export default function CodeTaskEditor({ variants, className }: Props) {
    const { lang } = useCodeEditor();
    
    const initialValue = useMemo(() => {
        const variant = variants?.find(
            ({ lang: language }) => lang === language,
        );
        const userSolution = variant?.codeTaskSolutions;

        return userSolution?.length
            ? userSolution[0].code
            : variant?.starterCode;
    }, [lang]);

    return <CodeEditor initialValue={initialValue} />;
}
