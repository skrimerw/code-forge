"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, ChangePasswordType } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { changePassword } from "./actions";

interface Props {
    token: string;
    className?: string;
}

export default function ChangePasswordForm({ token, className }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: ChangePasswordType) {
        try {
            setLoading(true);

            await changePassword(data.password, token);

            toast.success("Пароль сброшен");
            router.push("/signin");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);

                console.log(e.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-5", className)}
            >
                <FormInput
                    type="password"
                    name="password"
                    label="Новый пароль"
                    placeholder="Введите новый пароль"
                    autoComplete="new-password"
                />
                <FormInput
                    type="password"
                    name="confirmPassword"
                    label="Подтверждение пароля"
                    placeholder="Введите пароль снова"
                    autoComplete="new-password"
                />
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
                        Отправить письмо
                    </span>
                </Button>
            </form>
        </FormProvider>
    );
}
