import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
    title: "Страница не найдена - CodeForge",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-dvh">
            <img className="size-28 mb-10" src="/img/logo.svg" alt="Logo" />
            <div className="text-center">
                <h1 className="text-5xl mb-5 text">Страница не найдена</h1>
                <p className="text-typography-secondary">
                    Кажется, мы не можем найти страницу, которую вы ищете
                </p>
                <Button className="text-lg h-12 px-10 mt-8" asChild>
                    <Link href={"/"}>
                        Главная
                        <MoveRight />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
