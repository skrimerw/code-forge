"use client";

import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { verifyEmail } from "./actions";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Props {
    email: string;
    password: string;
    className?: string;
}

export default function Verification({ email, password, className }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    return (
        <div className={cn("flex flex-col gap-5 max-w-sm w-full", className)}>
            <InputOTP
                containerClassName="mx-auto gap-2 justify-between w-full"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                pasteTransformer={(pasted) => pasted.replaceAll(/\D/g, "")}
                onChange={async (value) => {
                    if (value.length === 6) {
                        try {
                            setLoading(true);

                            const { message, ok } = await verifyEmail(
                                email,
                                Number(value),
                            );

                            if (!ok) {
                                toast.error(message);

                                return;
                            }

                            const { error } = await signIn("credentials", {
                                email,
                                password,
                                redirect: false,
                            });

                            if (error) {
                                toast.error(message);

                                return;
                            }

                            router.push("/");
                            toast.success("Вы успешно зарегистрированы");
                        } catch (e) {
                            console.log(e);
                        } finally {
                            setLoading(false);
                        }
                    }
                }}
            >
                {Array.from({ length: 6 }).map((_, i) => {
                    return (
                        <InputOTPGroup key={i}>
                            <InputOTPSlot className="w-11 h-12 sm:w-14 sm:h-16" index={i} />
                        </InputOTPGroup>
                    );
                })}
            </InputOTP>
            <Button className="gap-0" disabled={loading}>
                <div className="relative">
                    <span
                        className={cn(
                            "absolute opacity-0 -left-2.5 top-1/2 -translate-y-1/2 invisible transition-opacity duration-300",
                            loading && "opacity-100 visible",
                        )}
                    >
                        <Loader2 className="animate-spin" />
                    </span>
                </div>
                <span
                    className={cn(
                        "transition-transform duration-300",
                        loading && "translate-x-4",
                    )}
                >
                    Продолжить
                </span>
            </Button>
        </div>
    );
}
