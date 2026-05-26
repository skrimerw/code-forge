"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import FormInput from "../form/FormInput";
import FormTextarea from "../form/FormTextarea";
import axios from "axios";
import { toast } from "react-toastify";
import { useCourseData } from "@/contexts/useCourseData";
import FileInput from "../form/FileInput";
import { EditCourseSchema, EditeCourseType } from "@/lib/schemas/course";

interface Props {
    className?: string;
}

export default function EditCourseForm({ className }: Props) {
    const { course, setCourse } = useCourseData();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(EditCourseSchema),
        defaultValues: {
            logo: course.imageUrl || "",
            description: course.description || "",
            title: course.title,
        },
    });

    async function onSubmit(data: EditeCourseType) {
        try {
            setLoading(true);

            const { data: respData } = await axios.put(
                `/api/courses/${course.id}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            setCourse(respData);

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
                <FileInput
                    name="logo"
                    label="Логотип"
                    description="Загрузите логотип курса"
                    accept="image/*"
                    defaultValue={course.imageUrl}
                />
                <FormInput
                    name="title"
                    label="Название"
                    placeholder="Введите название"
                    defaultValue={course.title}
                />
                <FormTextarea
                    name="description"
                    label="Краткое описание"
                    placeholder="Введите краткое описание"
                    defaultValue={course.description || ""}
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
