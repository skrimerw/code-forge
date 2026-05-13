import { Difficulty } from "@prisma/client";
import z from "zod";

export const EditTestTaskSchema = z.object({
    title: z.string().nonempty("Придумайте название задания"),
    difficulty: z
        .string()
        .refine(
            (val) => Object.keys(Difficulty).includes(val),
            "Выберите корректную сложность",
        ),
    body: z.array(
        z.object({
            id: z.number(),
            title: z.string().nonempty("Придумайте текст вопроса"),
            type: z.string(),
            actualAnswer: z.number().or(z.array(z.number())),
            answers: z.array(
                z.object({
                    id: z.number(),
                    label: z.string(),
                }),
            ),
        }),
    ),
});

export type EditTestTaskType = z.infer<typeof EditTestTaskSchema>;
