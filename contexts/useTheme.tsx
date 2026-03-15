"use client";

import { createContext, useContext, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (val: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
    initialTheme,
    children,
}: {
    initialTheme: Theme;
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return ctx;
}
