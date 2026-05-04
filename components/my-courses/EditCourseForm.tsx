"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { Loader2, Save } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import FormTextarea from "../form/FormTextarea";
import axios from "axios";
import { toast } from "react-toastify";

export const EditCourseSchema = z.object({
    title: z.string().nonempty("Пожалуйста введите название"),
    description: z.string().optional(),
});

interface Props {
    initialData: Course;
    className?: string;
}

export default function EditCourseForm({ initialData, className }: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(EditCourseSchema),
        defaultValues: {
            description: initialData.description || "",
            title: initialData.title,
        },
    });

    async function onSubmit(data: z.infer<typeof EditCourseSchema>) {
        try {
            setLoading(true);

            await axios.put(`/api/courses/${initialData.id}`, data);

            toast.success("Данные сохранены");
        } catch (e) {
            toast.error("Не удалось сохранить данные");
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-4", className)}
            >
                <FormInput
                    name="title"
                    label="Название"
                    defaultValue={initialData.title}
                />
                <FormTextarea
                    name="description"
                    label="Краткое описание"
                    defaultValue={initialData.description || ""}
                    className="[&>div>textarea]:min-h-[150px]"
                />
                <Button disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Save />}
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
}
