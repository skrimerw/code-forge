import SigninForm from "@/components/auth/SigninForm";
import React from "react";

export default function SigninPage() {
    return (
        <>
            <div className="flex flex-col gap-1 mb-16">
                <h1 className="font-semibold text-[32px]">Добро пожаловать!</h1>
                <h2 className="text-center text-typography-secondary font-medium">
                    Вход
                </h2>
            </div>
            <SigninForm />
        </>
    );
}
