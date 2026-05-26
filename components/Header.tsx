import { cn } from "@/lib/utils";
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import ProfileBtn from "./ProfileBtn";
import { auth } from "@/auth";
import Link from "next/link";
import ColorThemeBtn from "./ColorThemeBtn";

interface Props {
    className?: string;
}

export default async function Header({ className }: Props) {
    const session = await auth();

    return (
        <header
            className={cn(
                "top-0 bg-bg-2 rounded-b-lg shadow-[0_0_5px_0_rgba(0,0,0,0.1)] py-5 h-fit hidden sm:block",
                className,
            )}
        >
            <Container className="flex items-center py-0">
                <Link href={"/"} className="w-[170px] mr-10 md:mr-20">
                    <Logo />
                </Link>
                <ul className="flex gap-6 md:gap-10">
                    <li className="transition-opacity hover:opacity-70">
                        <Link href={"/sandbox"}>Редактор кода</Link>
                    </li>
                    <li className="transition-opacity hover:opacity-70">
                        <Link href={"/my-courses"}>Мои курсы</Link>
                    </li>
                </ul>
                <div className="flex items-center gap-4 md:gap-8 ml-auto">
                    <ColorThemeBtn />
                    <ProfileBtn session={session} />
                </div>
            </Container>
        </header>
    );
}
