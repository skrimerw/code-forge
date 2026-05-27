import { Module, Theme } from "@prisma/client";
import React from "react";
import ContentSecondLevel from "./ContentSecondLevel";

interface Props {
    courseId: number;
    module: Module;
    themes: Theme[];
    className?: string;
}

export default function ContentFirstLevel({
    courseId,
    module: { title, order: moduleOrder },
    themes,
    className,
}: Props) {
    return (
        <div className={className}>
            <div className="border border-l-4 py-3.5 pl-8 pr-5 bg-bg-2">
                <h2 className="font-medium text-lg">
                    <span className="text-base text-primary/50 dark:text-white/50 font-mono mr-2">
                        {moduleOrder}.
                    </span>
                    {title}
                </h2>
            </div>
            {themes.length > 0 && (
                <div className="ml-5 sm:ml-10 border border-l-4 border-t-0 divide-y">
                    {themes.map((theme) => {
                        const { id } = theme;
                        return (
                            <ContentSecondLevel
                                key={id}
                                courseId={courseId}
                                moduleOrder={moduleOrder}
                                theme={theme}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
