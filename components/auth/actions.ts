"use server";

import { signIn } from "@/auth";
import { SignUpSchema, SignUpSchemaType } from "@/lib/schemas/auth";
import prisma from "@/prisma/prisma-client";
import { hash } from "bcrypt";
import z, { ZodError } from "zod";

interface ResponseMessage {
    message: string;
    ok: boolean;
}

export async function signUp(data: SignUpSchemaType): Promise<ResponseMessage> {
    try {
        const { email, password } = await SignUpSchema.parseAsync(data);

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

        await prisma.user.create({
            data: {
                email,
                password: await hash(password, 10),
            },
        });

        const { error } = await signIn("credentials", {
            ...data,
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
