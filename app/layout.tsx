import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import { Theme, ThemeProvider } from "@/contexts/useTheme";
import { cookies } from "next/headers";
import "./globals.css";
import ToastWrapper from "@/components/ToastWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CodeForge",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();

    let theme: Theme = cookieStore.get("theme")?.value as never;

    if (!theme || !["light", "dark"].includes(theme)) {
        theme = "light";
    }

    return (
        <html lang="ru">
            <body
                className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-bg-1 min-h-screen grid grid-rows-[1fr_auto] sm:grid-rows-[auto_1fr_auto] ${theme === "light" ? "" : "dark"}`}
            >
                <TooltipProvider>
                    <ThemeProvider initialTheme={theme}>
                        <SessionProvider>
                            {children}
                            <ToastWrapper />
                            <NextTopLoader
                                showSpinner={false}
                                color="var(--top-loader)"
                                height={2}
                                showForHashAnchor={false}
                            />
                        </SessionProvider>
                    </ThemeProvider>
                </TooltipProvider>
            </body>
        </html>
    );
}
