import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface SuccesModalrContextValue {
    isSolved: boolean;
    open: boolean;
    setOpen: (val: boolean) => void;
    setIsSolved: (val: boolean) => void;
}

const SuccessModalContext = createContext<SuccesModalrContextValue | null>(
    null,
);

export function SuccessModalProvider({
    isSolvedInitial = false,
    children,
}: {
    isSolvedInitial?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [isSolved, setIsSolved] = useState(isSolvedInitial);
    
    return (
        <SuccessModalContext.Provider
            value={{ open, setOpen, isSolved, setIsSolved }}
        >
            {children}
        </SuccessModalContext.Provider>
    );
}

export function useSuccessModal() {
    const ctx = useContext(SuccessModalContext);

    if (!ctx) {
        throw new Error("useCodeEditor must be used within CodeEditorProvider");
    }

    return ctx;
}
