"use client";

import { cn, getEmptyQuestion } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestTask } from "@prisma/client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { EditTestTaskSchema, EditTestTaskType } from "@/lib/schemas/test-task";
import DifficultyDropdown from "../DifficultyDropdown";
import { Question } from "@/lib/mock-test";
import TestBuilder from "./TestBuilder";

interface Props {
    themeTitle: string;
    task: TestTask;
    className?: string;
}

export default function EditTestTaskForm({
    themeTitle,
    task,
    className,
}: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(EditTestTaskSchema),
        defaultValues: {
            title: task.title,
            difficulty: task.difficulty,
            body: task.body ? (task.body as Question[]) : [getEmptyQuestion()],
        },
    });

    async function onSubmit(data: EditTestTaskType) {
        try {
            setLoading(true);

            await axios.post(`/api/test-task/${task.id}`, data);

            toast.success("Данные сохранены");
        } catch (e) {
            console.log(e);
            toast.error("Не удалось сохранить данные");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Link
                href={".."}
                className="flex items-center hover:underline gap-2 mb-5 w-fit"
            >
                <ArrowLeft size={18} /> {themeTitle}
            </Link>
            <FormProvider  {...form}>
                <form
                    className={cn("flex flex-col gap-4 max-w-3xl", className)}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="flex gap-4 items-end w-full">
                        <FormInput
                            name="title"
                            defaultValue={task.title}
                            label="Название теста"
                            placeholder="Введите название теста"
                            className="w-full"
                        />
                        <DifficultyDropdown form={form} />
                    </div>
                    <div className="mt-5">
                        <h2 className="font-medium text-xl mb-2">
                            Конструктор тестов
                        </h2>
                        <TestBuilder />
                    </div>
                    <Button className="w-fit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Save />
                        )}
                        Сохранить
                    </Button>
                </form>
            </FormProvider>
        </div>
    );
}
