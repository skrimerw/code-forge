import PasswordResetEmail from "@/components/email-templates/PasswordResetEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    await resend.emails.send({
        from: "CodeForge <onboarding@resend.dev>",
        to: ["skrimerw@gmail.com"],
        subject: "Сброс пароля",
        react: PasswordResetEmail({
            token: "asdasdasdasdasdfkwrjifowjdvnewgnoewivnkl",
        }),
    });

    return NextResponse.json({});
}
