"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface Props {
    headings: {
      id: string,
      text: string
    }[]
    className?: string;
}

export default function TableOfContents({ className, headings }: Props) {
    const [active, setActive] = useState("");
    const [indicator, setIndicator] = useState({ top: 0, height: 0 });

    function intersectionCallback(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
            if (
                entry.intersectionRect.height /
                    (entry.rootBounds?.height || 1) >
                    0.5 &&
                entry.isIntersecting
            ) {
                const entryId = entry.target.ariaLabel || "";
                const li = document.querySelector(
                    `li[aria-label="${entryId}"]`,
                );
                const height = li?.clientHeight || 0;
                const lis = document.querySelectorAll(
                    ".table-of-contents-list>li",
                );

                let top = 0;

                for (const li of lis) {
                    if (li.ariaLabel == entryId) break;

                    top += li.clientHeight + 8;
                }

                setActive(entryId);
                setIndicator({ top, height });

                return;
            }
        });
    }

    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            threshold: [0, 0.25, 0.5, 0.75, 1],
        };

        const observer = new IntersectionObserver(
            intersectionCallback,
            options,
        );

        const sections = document.querySelectorAll(
            ".article-content section",
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }, []);
    return (
        <aside
            className={cn(
                "flex flex-col gap-5 min-w-xs sticky inset-0 top-10 h-full",
                className,
            )}
        >
            <h2 className="text-xl font-medium">В этой статье:</h2>
            <div className="flex">
                <div className="w-0.75 bg-[#D9D9D9] relative">
                    <span
                        className={cn(
                            `absolute inline-block bg-primary w-full transition-all`,
                        )}
                        style={{
                            top: indicator.top,
                            height: indicator.height,
                        }}
                    ></span>
                </div>
                <ul className="table-of-contents-list flex flex-col gap-2 text-typography-secondary">
                    {headings.map(({ id, text }) => {
                        return (
                            <li
                                key={id}
                                className={cn(
                                    "leading-5 transition-colors duration-200 hover:text-foreground pl-4",
                                    active === id && "text-foreground font-medium",
                                )}
                                aria-label={id}
                            >
                                <a href={`#${id}`} className="block leading-5">{text}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
