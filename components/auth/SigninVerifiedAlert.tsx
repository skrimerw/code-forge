"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function SigninVerifiedAlert() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        async function readCookie() {
            if (window) {
                const msgCookie = await window.cookieStore.get(
                    "signin_verificated_message",
                );

                if (msgCookie?.value) {
                    setIsVisible(true);
                }
            }
        }

        readCookie();
    }, []);

    async function closeAlert() {
        setIsVisible(false)
        window.cookieStore.delete("signin_verificated_message");
    }

    return (
        isVisible && (
            <div className="flex flex-col p-3 rounded-md border-easy-foreground border bg-easy-background -mt-14">
                <div className="flex justify-between">
                    <h3 className="text-easy-foreground font-medium">
                        Ваш email подтвержден
                    </h3>
                    <X
                        onClick={closeAlert}
                        className="size-4 -mt-1 -mr-1 text-easy-foreground rounded-xs hover:bg-black/5 cursor-pointer transition-all"
                    />
                </div>
                <p className="text-sm">Введите свои данные, чтобы войти</p>
            </div>
        )
    );
}
