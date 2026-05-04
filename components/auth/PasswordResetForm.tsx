"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { sendResetEmail } from "./actions";
import { ResetPasswordSchema, ResetPasswordType } from "@/lib/schemas/auth";

interface Props {
    className?: string;
}

export default function PasswordResetForm({ className }: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: ""
        },
    });

    async function onSubmit(data: ResetPasswordType) {
        try {
            setLoading(true);

            await sendResetEmail(data);

            toast.success("Письмо отправлено на " + data.email);
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
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Введите ваш email"
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
