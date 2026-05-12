import { Difficulty } from "@prisma/client";
import z from "zod";

export const EditCodeTaskSchema = z.object({
    title: z.string().nonempty("Придумайте название задания"),
    description: z.string().nonempty("Придумайте описание задания"),
    difficulty: z
        .string()
        .refine(
            (val) => Object.keys(Difficulty).includes(val),
            "Выберите корректную сложность",
        ),
    initialCode: z.string().nonempty("Введите начальный код задания"),
    testCode: z.string().nonempty("Введите начальный код тестов"),
});

export type EditCodeTaskType = z.infer<typeof EditCodeTaskSchema>;
