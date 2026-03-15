import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { Theme, ThemeProvider } from "@/contexts/useTheme";
import { cookies } from "next/headers";

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
                className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-bg-1 min-h-screen grid grid-rows-[auto_1fr_auto] ${theme === "light" ? "" : "dark"}`}
            >
                <ThemeProvider initialTheme={theme}>
                    <SessionProvider>
                        {children}
                        <ToastContainer
                            position="top-center"
                            draggable={true}
                            stacked={true}
                            autoClose={2000}
                            limit={1}
                            theme={theme}
                        />
                        <NextTopLoader
                            showSpinner={false}
                            color="var(--top-loader)"
                            height={2}
                            showForHashAnchor={false}
                        />
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
