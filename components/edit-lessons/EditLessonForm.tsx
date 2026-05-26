"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2, Save } from "lucide-react";
import FormTextarea from "../form/FormTextarea";
import { CodeTask, TestTask, Theme } from "@prisma/client";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { EditLessonSchema, EditLessonType } from "@/lib/schemas/edit-lesson";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TaskList from "./TaskList";
import FormEditor from "../form/FormEditor";
import FileInput from "../form/FileInput";

interface Props {
    testTasks: TestTask[];
    codeTasks: CodeTask[];
    initialData: Theme;
    className?: string;
}

export default function EditLessonForm({
    testTasks,
    codeTasks,
    initialData,
    className,
}: Props) {
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [deletedTestIds, setDeletedTestIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(EditLessonSchema),
        defaultValues: {
            logo: initialData.imageUrl,
            title: initialData.title,
            description: initialData.description,
            content: initialData.content,
            codeTasks: codeTasks.map((task) => ({ ...task, fakeId: task.id })),
            testTasks: testTasks.map((task) => ({ ...task, fakeId: task.id })),
        },
    });

    async function onSubmit(data: EditLessonType) {
        try {
            setLoading(true);
            const { data: respData } = await axios.put(
                `/api/themes/${initialData.id}`,
                {
                    ...data,
                    codeTasks: JSON.stringify(
                        data.codeTasks.filter(
                            (task) => !deletedIds.includes(task.fakeId),
                        ),
                    ),
                    testTasks: JSON.stringify(
                        data.testTasks.filter(
                            (task) => !deletedTestIds.includes(task.fakeId),
                        ),
                    ),
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            form.reset({
                ...respData,
                logo: respData.imageUrl,
                codeTasks: respData.codeTasks.map((task: CodeTask) => ({
                    ...task,
                    fakeId: task.id,
                })),
                testTasks: respData.testTasks.map((task: TestTask) => ({
                    ...task,
                    fakeId: task.id,
                })),
            });

            toast.success("Данные сохранены");
        } catch (e) {
            console.log(e);
            toast.error("Не удалось сохранить данные");
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "flex flex-col gap-4 w-full max-w-3xl",
                    className,
                )}
            >
                <FileInput
                    name="logo"
                    description="Загрузите логотип темы"
                    label="Логотип"
                    accept="image/*"
                    defaultValue={initialData.imageUrl}
                />
                <FormInput
                    name="title"
                    label="Название"
                    placeholder="Введите название"
                    defaultValue={initialData.title}
                    className="max-w-3xl"
                />
                <FormTextarea
                    name="description"
                    label="Краткое описание"
                    placeholder="Введите описание"
                    defaultValue={initialData.description}
                    className="[&>div>textarea]:max-h-[350px]"
                />
                <FormEditor
                    name="content"
                    label="Текст статьи"
                    className="article-content-editor w-full"
                />

                <div className="mt-10">
                    <h2 className="font-medium mb-2 text-2xl">Задания</h2>
                    <Tabs defaultValue="codeTasks">
                        <div className="border-b">
                            <TabsList>
                                <TabsTrigger value="codeTasks">
                                    Программирование
                                </TabsTrigger>
                                <TabsTrigger value="testTasks">
                                    Тесты
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="codeTasks" className="mt-4">
                            <TaskList
                                name="codeTasks"
                                form={form}
                                deletedIds={deletedIds}
                                setDeletedIds={setDeletedIds}
                            />
                        </TabsContent>
                        <TabsContent value="testTasks" className="mt-4">
                            <TaskList
                                name="testTasks"
                                form={form}
                                deletedIds={deletedTestIds}
                                setDeletedIds={setDeletedTestIds}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <Button
                    type="button"
                    onClick={() => {
                        window.scrollTo({
                            top: form.formState.errors["logo"]?.ref?.offsetTop,
                        });

                        form.handleSubmit(onSubmit)();
                    }}
                    disabled={loading}
                    className="w-fit px-7"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save />}
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
}
