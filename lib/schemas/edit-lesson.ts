import { Difficulty } from "@prisma/client";
import z from "zod";

export const EditLessonSchema = z.object({
    title: z.string().nonempty("Придумайте название темы"),
    description: z
        .string()
        .nonempty("Придумайте краткое описание темы")
        .max(256, "Максимальный размер описания - 256 символов"),
    content: z.string().nonempty("Заполните текст статьи"),
    codeTasks: z.array(
        z.object({
            fakeId: z.number(),
            title: z.string().nonempty("Придумайте название задания"),
            difficulty: z
                .string()
                .refine(
                    (val) => Object.keys(Difficulty).includes(val),
                    "Выберите корректную сложность",
                ),
        }),
    ),
    testTasks: z.array(
        z.object({
            fakeId: z.number(),
            title: z.string().nonempty("Придумайте название задания"),
            difficulty: z
                .string()
                .refine(
                    (val) => Object.keys(Difficulty).includes(val),
                    "Выберите корректную сложность",
                ),
        }),
    ),
});

export type EditLessonType = z.infer<typeof EditLessonSchema>;
