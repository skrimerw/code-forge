"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInSchemaType } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import GitHub from "../icons/GitHub";
import OAuthBtn from "./OAuthBtn";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Google from "../icons/Google";
import { useTopLoader } from "nextjs-toploader";

interface Props {
    className?: string;
}

export default function SigninForm({ className }: Props) {
    const form = useForm({
        resolver: zodResolver(SignInSchema),
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

    async function onSubmit(data: SignInSchemaType) {
        try {
            setLoading(true);

            const { error, code } = await signIn("credentials", {
                ...data,
                redirect: false,
            });

            if (error) {
                toast.error(code);

                return;
            }

            toast.success("Вы авторизваны!");

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
                            Войти
                        </span>
                    </Button>
                </form>
                <div className="relative">
                    <hr />
                    <span className="absolute left-1/2 -top-4 -translate-x-1/2 bg-primary-foreground text-typography-secondary p-1">
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
        </div>
    );
}
