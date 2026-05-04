import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import prisma from "@/prisma/prisma-client";
import { redirect } from "next/navigation";
import React from "react";

export default async function ChangePasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token: string }>;
}) {
    const token = (await searchParams).token;
    const findToken = await prisma.passwordResetToken.findFirst({
        where: {
            token,
        },
    });

    if (!!!token || !findToken) {
        redirect("/");
    }

    const tokenTimeZone = findToken.createdAt.getTimezoneOffset();
    let curTime = Date.now();
    let curDate = new Date(curTime);

    if (tokenTimeZone !== curDate.getTimezoneOffset()) {
        curTime +=
            (tokenTimeZone - curDate.getTimezoneOffset()) * 60 * 60 * 1000;
    }

    if ((curTime - findToken.createdAt.getTime()) / (60 * 60 * 1000) > 3) {
        redirect("/");
    }

    return (
        <div className="max-w-sm">
            <p className="text-center text-primary/70 text-[15px] mb-14">
                Ваш новый пароль должен отличаться от прошлого
            </p>
            <ChangePasswordForm token={token} />
        </div>
    );
}
