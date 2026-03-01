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
        <main className="flex min-h-screen justify-center items-stretch">
            <div className="py-16 ml-auto w-1/2 flex flex-col items-center">
                {session?.user ? (
                    <Link href={"/"}>
                        <Logo className="w-42.5 mb-4 cursor-default" />
                    </Link>
                ) : (
                    <Logo className="w-42.5 mb-4 cursor-default" />
                )}
                {children}
            </div>
            <div className="overflow-hidden h-full w-1/2 bg-[url(/img/auth-hero.jpg)] bg-cover bg-left ml-auto flex-1">
                {/* <img
                    className="object-cover size-full"
                    src="/img/auth-hero.jpg"
                    alt="Заставка"
                /> */}
            </div>
        </main>
    );
}
