"use client";

import { trySignUp } from "@/components/auth/actions";
import SignupForm from "@/components/auth/SignupForm";
import Verification from "@/components/auth/Verification";
import { Button } from "@/components/ui/button";
import { SignUpSchema, SignUpSchemaType } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Step = "signup" | "verification";

export default function SignupPage() {
    const [step, setStep] = useState<Step>("signup");
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        resetOptions: {
            keepValues: true,
        },
    });

    async function onSubmit(data: SignUpSchemaType) {
        try {
            setLoading(true);

            const { ok, message } = await trySignUp(data);

            if (!ok) {
                toast.error(message);

                return;
            }

            setStep("verification");
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...form}>
            {step === "verification" && (
                <Button
                    variant={"link"}
                    className="absolute top-3 left-5 group"
                    onClick={() => setStep("signup")}
                >
                    <MoveLeft className="group-hover:-translate-x-1 transition-all duration-300" />
                    Назад
                </Button>
            )}
            <div className={cn("grid grid-cols-1 transition-all duration-300 w-full")}>
                <div
                    className={cn(
                        "flex flex-col items-center col-start-1 col-end-2 row-start-1 row-end-2 transition-all duration-500 w-full mx-auto",
                        step === "signup"
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible translate-y-5",
                    )}
                    style={{
                        transitionDelay:
                            step === "signup" ? "500ms" : "0ms",
                    }}
                >
                    <div className="flex flex-col gap-1 mb-16">
                        <h1 className="font-semibold text-[32px] text-center">
                            Добро пожаловать!
                        </h1>
                        <h2 className="text-center text-typography-secondary font-normal">
                            Регистрация
                        </h2>
                    </div>
                    <SignupForm
                        onSubmit={form.handleSubmit(onSubmit)}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </div>
                <div
                    className={cn(
                        "col-start-1 col-end-2 row-start-1 row-end-2 transition-all duration-500",
                        step === "verification"
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible translate-y-5",
                    )}
                    style={{
                        transitionDelay:
                            step === "verification" ? "500ms" : "0ms",
                    }}
                >
                    <div className="flex flex-col gap-1 mb-16">
                        <h1 className="font-semibold text-[32px] text-center">
                            Подтверждение почты
                        </h1>
                        <h2 className="text-center text-typography-secondary font-normal">
                            Мы отправили код на{" "}
                            <span className="font-semibold">
                                {form.watch("email")}
                            </span>
                            . Введите его ниже
                        </h2>
                    </div>
                    <Verification
                        className="mx-auto"
                        email={form.watch("email")}
                        password={form.watch("password")}
                    />
                </div>
            </div>
        </FormProvider>
    );
}
