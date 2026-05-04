"use server";

import {
    ResetPasswordType,
    SignUpSchema,
    SignUpSchemaType,
} from "@/lib/schemas/auth";
import prisma from "@/prisma/prisma-client";
import z, { ZodError } from "zod";
import { Resend } from "resend";
import VerificationEmail from "../email-templates/VerificationEmail";
import { signIn } from "@/auth";
import { compareSync, hashSync } from "bcrypt";
import PasswordResetEmail from "../email-templates/PasswordResetEmail";
import { randomBytes } from "crypto";

interface ResponseMessage {
    message: string;
    ok: boolean;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function trySignUp(
    data: SignUpSchemaType,
): Promise<ResponseMessage> {
    const parseData = data;

    try {
        const { email, password } = await SignUpSchema.parseAsync(parseData);

        const findUser = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (findUser) {
            return {
                message: "Такой пользователь уже существует",
                ok: false,
            };
        }

        const findCode = await prisma.verificationCode.findFirst({
            where: {
                email,
            },
        });

        if (findCode) {
            await prisma.verificationCode.delete({
                where: {
                    id: findCode.id,
                },
            });
        }

        const code = Math.floor(100000 + Math.random() * 900000);

        await prisma.verificationCode.create({
            data: {
                email,
                code,
                password: hashSync(password, 10),
            },
        });

        const { error } = await resend.emails.send({
            from: "CodeForge <onboarding@resend.dev>",
            to: [email],
            subject: "Подтверждение email",
            react: VerificationEmail({ code, email }),
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            message: "VERIFY_REDIRECT",
            ok: true,
        };
    } catch (e) {
        let msg = "Server-side error";
        if (e instanceof Error) {
            msg = e?.message;

            if (e instanceof ZodError) {
                console.error(z.treeifyError(e));
            } else {
                console.error(e);
            }
        }

        return {
            message: msg,
            ok: false,
        };
    }
}

export async function verifyEmail(
    email: string,
    code: number,
): Promise<ResponseMessage> {
    const findCode = await prisma.verificationCode.findFirst({
        where: {
            email,
        },
    });

    if (findCode?.code !== code) {
        return {
            message: "Неверный код. Попробуйте другой",
            ok: false,
        };
    }

    const deletedCode = await prisma.verificationCode.delete({
        where: {
            email,
        },
    });

    await prisma.user.create({
        data: {
            email,
            password: deletedCode.password,
            isVerified: true,
        },
    });

    return {
        message: "Email подтвержден",
        ok: true,
    };
}

export async function signUp(
    email: string,
    password: string,
): Promise<ResponseMessage> {
    const { error } = await signIn("credentials", {
        email,
        password,
        redirect: false,
    });

    if (error) {
        return {
            message: "Не удалось авторизовать пользователя",
            ok: false,
        };
    }

    return {
        message: "Вы успешно зарегистрированы",
        ok: true,
    };
}

export async function sendResetEmail({ email }: ResetPasswordType) {
    const findUser = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!findUser) {
        throw new Error("Такого пользователя не существует");
    }

    let token = "";

    while (true) {
        token = randomBytes(32).toString("hex");

        const findExisitingToken = await prisma.passwordResetToken.count({
            where: {
                token,
            },
        });

        if (findExisitingToken === 0) {
            await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: findUser.id,
                },
            });

            break;
        }
    }

    const { error } = await resend.emails.send({
        from: "CodeForge <onboarding@resend.dev>",
        to: [email],
        subject: "Сброс пароля",
        react: PasswordResetEmail({ token }),
    });

    if (error) {
        throw new Error(error.message);
    }
}

export async function changePassword(newPassword: string, token: string) {
    const findToken = await prisma.passwordResetToken.findFirst({
        where: {
            token,
        },
        include: {
            user: true,
        },
    });

    if (!findToken) {
        throw new Error("Пользователь не найден");
    }

    if (compareSync(newPassword, findToken.user.password)) {
        throw new Error("Новый пароль должен отличаться от прошлого");
    }

    await prisma.passwordResetToken.delete({
        where: {
            token,
            userId: findToken.userId,
        },
    });

    await prisma.user.update({
        where: {
            id: findToken.userId,
        },
        data: {
            password: hashSync(newPassword, 10),
        },
    });
}
