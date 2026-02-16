import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased bg-primary-foreground min-h-screen grid grid-rows-[auto_1fr_auto]`}
      >
        <NextTopLoader showSpinner={false} color="var(--primary)" height={2} showForHashAnchor={false} />
        {children}
      </body>
    </html>
  );
}
