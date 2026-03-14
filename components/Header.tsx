import { cn } from "@/lib/utils";
import React from "react";
import Container from "./Container";
import { Moon } from "lucide-react";
import { Button } from "./ui/button";
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
        "top-0 bg-white rounded-b-lg shadow-[0_0_5px_0_rgba(0,0,0,0.1)] py-5 h-fit",
        className
      )}
    >
      <Container className="flex items-center justify-between py-0">
        <Link href={"/"} className="w-[170px]">
          <Logo />
        </Link>
        <ul className="flex gap-10">
          <li className="transition-colors hover:text-primary/70">
            <Link href={"/sandbox"}>Редактор кода</Link>
          </li>
        </ul>
        <div className="flex items-center gap-8">
          <ColorThemeBtn />
          <ProfileBtn session={session} />
        </div>
      </Container>
    </header>
  );
}
