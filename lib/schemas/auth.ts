import z from "zod";

export const SignInSchema = z.object({
    email: z.email(
        "Пожалуйста, введите корректный email (например, example@test.com)",
    ),
    password: z
        .string()
        .min(6, "Минимальная длина пароля - 6 символов")
        .max(20, "Максимальная длина пароля - 20 символов"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
    email: z.email(
        "Пожалуйста, введите корректный email (например, example@test.com)",
    ),
    password: z
        .string()
        .min(6, "Минимальная длина пароля - 6 символов")
        .max(20, "Максимальная длина пароля - 20 символов"),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
