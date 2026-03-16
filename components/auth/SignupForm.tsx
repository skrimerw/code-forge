"use client";

import Link from "next/link";
import React, { useState } from "react";
import OAuthBtn from "./OAuthBtn";
import GitHub from "../icons/GitHub";
import Google from "../icons/Google";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SignUpSchema, SignUpSchemaType } from "@/lib/schemas/auth";
import { signUp } from "./actions";

interface Props {
    className?: string;
}

export default function SignupForm({ className }: Props) {
    const form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const loader = useTopLoader();
    const router = useRouter();

    function onOAuthClick() {
        setLoading(true);
        loader.start();
    }

    async function onSubmit(data: SignUpSchemaType) {
        try {
            setLoading(true);

            const { ok, message } = await signUp(data);

            if (!ok) {
                toast.error(message);

                return;
            }

            toast.success("Вы авторизованы!");

            router.push("/");
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-5 max-w-sm w-full">
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
                        disabled={loading}
                    />
                    <FormInput
                        type="password"
                        name="password"
                        label="Пароль"
                        placeholder="Введите ваш пароль"
                        autoComplete="off"
                        disabled={loading}
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
                            Зарегистрироваться
                        </span>
                    </Button>
                </form>
                <div className="relative">
                    <hr />
                    <span className="absolute left-1/2 -top-4 -translate-x-1/2 bg-bg-1 text-typography-secondary p-1">
                        или
                    </span>
                </div>
            </FormProvider>
            <div className="grid grid-cols-2 gap-2 w-full">
                <OAuthBtn
                    onClick={onOAuthClick}
                    disabled={loading}
                    provider="github"
                >
                    <GitHub /> GitHub
                </OAuthBtn>
                <OAuthBtn
                    onClick={onOAuthClick}
                    disabled={loading}
                    provider="google"
                >
                    <Google /> Google
                </OAuthBtn>
            </div>

            <p className="text-center text-typography-secondary text-sm">
                Уже есть аккаунт?{" "}
                <Link
                    href={"/signin"}
                    className="underline transition-colors duration-300 hover:text-foreground"
                >
                    Войти
                </Link>
            </p>
        </div>
    );
}
