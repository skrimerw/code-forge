"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { BookOpenText, MoveUp, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  content: string;
  className?: string;
}

export default function TheoryButton({ title, content, className }: Props) {
  const scrollTopRef = useRef(0);
  const [isGoUpVisible, setIsGoUpVisible] = useState(false);

  function goUp() {
    const contentRef = document.querySelector(".dialog-content");

    if (contentRef) {
      contentRef.scrollTop = 0;
    }
  }

  function handleScrollContent(e: React.UIEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;

    if (target.scrollTop > 100) {
      setIsGoUpVisible(true);
    } else {
      setIsGoUpVisible(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setTimeout(() => {
          const contentRef = document.querySelector(".dialog-content");
          if (contentRef) {
            if (open) {
              contentRef.scrollTo({
                behavior: "instant",
                top: scrollTopRef.current,
              });
            } else {
              scrollTopRef.current = contentRef.scrollTop;
            }
          }
        });
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className={cn(
            "text-foreground bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-[#f8f8f8] p-2.5 flex items-center justify-center",
            className
          )}
        >
          <BookOpenText />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden h-[calc(100dvh-80px)] w-[calc(100dvw-80px)] max-w-4xl! p-0"
      >
        <DialogTitle className="absolute" />
        <DialogDescription className="absolute"></DialogDescription>
        <DialogClose className="absolute right-6 top-6 rounded-full bg-white cursor-pointer shadow-[0_0_8px_0px_rgba(0,0,0,0.15)] hover:shadow-[0_0_10px_0px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 active:scale-95 p-2">
          <X />
        </DialogClose>
        <div
          onScroll={handleScrollContent}
          className="dialog-content overflow-auto p-6 pb-16 scroll-smooth"
        >
          <h1 className="text-3xl font-semibold my-8">{title}</h1>

          <article
            className="article-container"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></article>
          <Button
            onClick={goUp}
            className={cn(
              "fixed bottom-3 left-1/2 -translate-x-1/2 rounded-full hover:bg-[#6a6a6a] py-2 text-sm opacity-0 transition-all duration-300 invisible translate-y-10 scale-30",
              isGoUpVisible && "opacity-100 visible translate-y-0 scale-100"
            )}
          >
            <MoveUp className="size-4!" />
            Вверх
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
