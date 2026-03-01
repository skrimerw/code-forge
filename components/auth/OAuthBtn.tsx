"use client";

import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { OAuthProviderId } from "../../node_modules/@auth/core/src/providers/provider-types";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    provider: OAuthProviderId;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function OAuthBtn({
    onClick,
    provider,
    children,
    className,
    ...props
}: Props) {
    async function handleClick() {
        try {
            onClick?.();
            await signIn(provider, { redirectTo: "/" });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            {...props}
            onClick={handleClick}
            className={cn(className)}
        >
            {children}
        </Button>
    );
}
