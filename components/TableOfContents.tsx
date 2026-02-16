"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface Props {
  className?: string;
}

const links = [
  {
    id: "heading_1",
    text: "Что такое массив в программировании",
  },
  {
    id: "heading_2",
    text: "Как создать массив и наполнить его данными",
  },
  {
    id: "heading_3",
    text: "Задания",
  },
];

export default function TableOfContents({ className }: Props) {
  const [active, setActive] = useState("");
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  function intersectionCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const entryId = entry.target.ariaLabel || "";        
        const li = document.querySelector(`li[aria-label="${entryId}"]`);
        const height = li?.clientHeight || 0;
        const lis = document.querySelectorAll(".table-of-contents-list>li");
        
        let top = 0;
        
        for (const li of lis) {
            if (li.ariaLabel == entryId) break;
            
            top += li.clientHeight + 6;
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
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(intersectionCallback, options);

    const sections = document.querySelectorAll(".article-container section");

    sections.forEach((section) => {
      observer.observe(section);
    });
  }, []);
  return (
    <aside
      className={cn(
        "flex flex-col gap-5 min-w-xs sticky inset-0 top-10 h-full",
        className
      )}
    >
      <h2 className="text-xl font-medium">В этой статье:</h2>
      <div className="flex">
        <div className="w-[3px] bg-[#D9D9D9] relative">
          <span
            className={cn(`absolute inline-block bg-primary w-full transition-all`)}
            style={{
              top: indicator.top,
              height: indicator.height,
            }}
          ></span>
        </div>
        <ul className="table-of-contents-list flex flex-col gap-2 ml-4 text-typography-secondary">
          {links.map(({ id, text }) => {
            return (
              <li
                key={id}
                className={cn(
                  "leading-[130%] transition-colors duration-200 hover:text-primary",
                  active === id && "text-primary font-medium"
                )}
                aria-label={id}
              >
                <a href={`#${id}`}>{text}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
