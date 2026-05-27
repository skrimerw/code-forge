import { cn } from "@/lib/utils";
import React from "react";
import Container from "./Container";
import { Code2, GraduationCap, Notebook } from "lucide-react";
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
                        matcher={[
                            "/",
                            "/course/[id]",
                            "/theme/[id]",
                            "/theme/[id]/task/[id]",
                        ]}
                        label="Курсы"
                        url="/"
                        icon={<Notebook size={20} />}
                    />
                    <NavigationPanelLink
                        matcher={["/sandbox"]}
                        label="Редактор кода"
                        url="/sandbox"
                        icon={<Code2 size={20} />}
                    />
                    <NavigationPanelLink
                        matcher={[
                            "/my-courses",
                            "/my-courses/[id]/description",
                            "/my-courses/[id]/content",
                            "/my-courses/[id]/check-list",
                            "/my-courses/[id]/edit-content",
                            "/edit-lessons/[id]/themes/[id]",
                            "/edit-lessons/[id]/themes/[id]/code-tasks/[id]",
                            "/edit-lessons/[id]/themes/[id]/test-tasks/[id]",
                        ]}
                        label="Преподавание"
                        url="/my-courses"
                        icon={<GraduationCap size={20} />}
                    />
                    <li className="text-[11px] transition-opacity hover:opacity-70">
                        <SettingsBtn />
                    </li>
                </ul>
            </Container>
        </div>
    );
}
