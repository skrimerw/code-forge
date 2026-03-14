"use client";

import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import { Button } from "./ui/button";
import { MoveRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSuccessModal } from "@/contexts/useSuccessModal";
import Success from "./lottie/Success";

export default function SuccessModal() {
    const { open, setOpen } = useSuccessModal();

    function handleOverlayClick(e: PointerEvent) {
        const target = e.target as Element;

        const dataSlot = target.getAttribute("data-slot");

        if (dataSlot && dataSlot === "dialog-overlay") {
            setOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleOverlayClick);

        return () => {
            document.removeEventListener("click", handleOverlayClick);
        };
    }, []);

    return (
        <Dialog open={open}>
            <DialogContent
                className="p-0 w-fit overflow-hidden"
                showCloseButton={false}
            >
                <button
                    className="absolute right-2 top-2 cursor-pointer hover:opacity-70  transition-colors"
                    onClick={() => setOpen(false)}
                >
                    <X className="size-5" />
                </button>
                <div className="absolute">
                    <DialogTitle />
                    <DialogDescription />
                </div>
                <div className="flex flex-col items-center p-10 pt-0">
                    <span
                        className={cn(
                            "block absolute inset-0 -z-1 bg-linear-180 from-easy-foreground/35 to-50% to-white",
                        )}
                    ></span>
                    
                    <Success />
                    <div className="flex flex-col -mt-3 items-center gap-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-medium text-center">
                                🏆 Задание выполнено!
                            </h2>
                            <p className="text-sm text-typography-secondary">
                                Следующий вызов ждёт вас!
                            </p>
                        </div>
                        <Link href={"/"}>
                            <Button className="group">
                                На главную{" "}
                                <MoveRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
