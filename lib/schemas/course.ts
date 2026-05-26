import z from "zod";

export const CreateCourseSchema = z.object({
    title: z.string().nonempty("Пожалуйста, введите название курса"),
});

export type CreateCourseType =  z.infer<typeof CreateCourseSchema>

export const EditCourseSchema = z.object({
    logo: z
        .instanceof(File)
        .refine((file) => {
            return file.type.startsWith("image/");
        }, "Выберите изображение")
        .refine((file) => {
            return file.size <= 5 * 1024 * 1024;
        }, "Размер файла не должен превышать 5MB")
        .or(z.string()),
    title: z.string().nonempty("Пожалуйста введите название"),
    description: z.string().optional(),
});

export type EditeCourseType =  z.infer<typeof EditCourseSchema>
