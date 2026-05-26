import { cn } from "@/lib/utils";
import React from "react";
import Container from "./Container";
import { Code2, Home, Notebook } from "lucide-react";
import NavigationPanelLink from "./NavigationPanelLink";
import SettingsBtn from "./SettingsBtn";

interface Props {
    className?: string;
}

export default async function NavigationPanel({ className }: Props) {
    return (
        <div
            className={cn(
                "navigation-panel sm:hidden bg-bg-2 rounded-t-lg shadow-[0_0_5px_0_rgba(0,0,0,0.1)] fixed z-10 bottom-0 right-0 left-0 py-3 sm:py-5 h-fit",
                className,
            )}
        >
            <Container className="flex items-center py-0">
                <ul className="flex gap-3 w-full justify-around">
                    <NavigationPanelLink
                        label="Главная"
                        url="/"
                        icon={<Home size={20} />}
                    />
                    <NavigationPanelLink
                        label="Редактор кода"
                        url="/sandbox"
                        icon={<Code2 size={20} />}
                    />
                    <NavigationPanelLink
                        label="Мои курсы"
                        url="/my-courses"
                        icon={<Notebook size={20} />}
                    />
                    <li className="text-[11px] transition-opacity hover:opacity-70">
                        <SettingsBtn />
                    </li>
                </ul>
            </Container>
        </div>
    );
}
