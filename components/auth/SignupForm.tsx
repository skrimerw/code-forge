"use client";

import Link from "next/link";
import React from "react";
import OAuthBtn from "./OAuthBtn";
import GitHub from "../icons/GitHub";
import Google from "../icons/Google";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import { useTopLoader } from "nextjs-toploader";

interface Props {
    loading: boolean;
    setLoading: (val: boolean) => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => void;
    className?: string;
}

export default function SignupForm({
    loading,
    setLoading,
    onSubmit,
    className,
}: Props) {
    const loader = useTopLoader();

    function onOAuthClick() {
        setLoading(true);
        loader.start();
    }

    return (
        <div className="flex flex-col gap-5 max-w-sm w-full">
            
            <form
                onSubmit={onSubmit}
                className={cn("flex flex-col gap-5", className)}
            >
                <FormInput
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Введите ваш email"
                />
                <FormInput
                    type="password"
                    name="password"
                    label="Пароль"
                    placeholder="Введите ваш пароль"
                    autoComplete="off"
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
