import { auth } from "@/auth";
import ColorThemeBtn from "@/components/ColorThemeBtn";
import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <main className="flex min-h-screen justify-center">
            <ColorThemeBtn className="fixed left-5 top-5 border border-border shadow-xs bg-bg-1" />
            <div className="py-20 px-3 mx-auto w-full sm:w-2/3 md:w-1/2 flex flex-col items-center">
                {session?.user ? (
                    <Link href={"/"}>
                        <Logo className="w-42.5 mb-4 cursor-pointer" />
                    </Link>
                ) : (
                    <Logo className="w-42.5 mb-4 cursor-default" />
                )}
                {children}
            </div>
            <div className="hidden lg:block overflow-hidden h-full w-1/2 bg-[url(/img/auth-hero.jpg)] dark:bg-[url(/img/auth-hero-dark.png)] bg-cover bg-left ml-auto flex-1"></div>
        </main>
    );
}
