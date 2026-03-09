import { auth } from "@/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
    children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
    const session = await auth();

    if (!session?.user) {
        redirect("/signin");
    }

    return (
        <>
            <Header />
            <main className="h-full">{children}</main>
            <Footer />
        </>
    );
}
