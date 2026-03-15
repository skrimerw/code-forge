import { createContext, useContext, useState } from "react";

interface SuccesModalContextValue {
    isSolved: boolean;
    open: boolean;
    setOpen: (val: boolean) => void;
    setIsSolved: (val: boolean) => void;
}

const SuccessModalContext = createContext<SuccesModalContextValue | null>(
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
        throw new Error("useSuccessModal must be used within SuccessModalProvider");
    }

    return ctx;
}
