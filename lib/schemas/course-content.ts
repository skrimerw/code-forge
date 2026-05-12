import z from "zod";

export const ContentSchema = z.object({
    modules: z.array(
        z.object({
            id: z.number(),
            title: z
                .string()
                .nonempty("Значение этого поля не может быть пустым"),
            fakeId: z.number(),
            themes: z.array(
                z.object({
                    id: z.number(),
                    fakeId: z.number(),
                    title: z.string().nonempty("Придумайте название темы"),
                    imageUrl: z.string(),
                }),
            ),
        }),
    ),
});

export type ContentSchemaType = z.infer<typeof ContentSchema>;
