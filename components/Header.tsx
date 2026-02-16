import { cn } from "@/lib/utils";
import React from "react";
import Container from "./Container";
import { Moon, User } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./Logo";

interface Props {
    className?: string;
}

export default function Header({ className }: Props) {
    return (
        <header
            className={cn(
                "top-0 bg-white rounded-b-lg shadow-[0_0_5px_0_rgba(0,0,0,0.1)] py-5",
                className,
            )}
        >
            <Container className="flex items-center justify-between py-0">
                <Logo />
                <div className="flex items-center gap-8">
                    <Button variant={"ghost"} className="p-0! size-10! w-auto">
                        <Moon strokeWidth={1.7} className="size-7.5" />
                    </Button>
                    <Button>
                        <User /> Профиль
                    </Button>
                </div>
            </Container>
        </header>
    );
}
