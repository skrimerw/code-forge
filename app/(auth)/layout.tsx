import { auth } from "@/auth";
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
        <main className="flex min-h-screen justify-center items-center">
            <div className="py-10 ml-auto w-1/2 flex flex-col items-center">
                {session?.user ? (
                    <Link href={"/"}>
                        <Logo className="w-42.5 mb-4 cursor-pointer" />
                    </Link>
                ) : (
                    <Logo className="w-42.5 mb-4 cursor-default" />
                )}
                {children}
            </div>
            <div className="overflow-hidden h-full w-1/2 bg-[url(/img/auth-hero.jpg)] bg-cover bg-left ml-auto flex-1"></div>
        </main>
    );
}
