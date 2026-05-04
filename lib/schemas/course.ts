import z from "zod";

export const CreateCourseSchema = z.object({
    title: z.string().nonempty("Пожалуйста, введите название курса"),
});

export type CreateCourseType =  z.infer<typeof CreateCourseSchema>