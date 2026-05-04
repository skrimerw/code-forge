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

export const ResetPasswordSchema = z.object({
    email: z.email(
        "Пожалуйста, введите корректный email (например, example@test.com)",
    ),
});

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, "Минимальная длина пароля - 6 символов")
            .max(20, "Максимальная длина пароля - 20 символов"),
        confirmPassword: z
            .string()
            .min(6, "Минимальная длина пароля - 6 символов")
            .max(20, "Максимальная длина пароля - 20 символов"),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "Пароли не совпадают",
                path: ["confirmPassword"],
            });
        }
    });

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
