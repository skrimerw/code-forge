"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, PlusCircle, Save } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentSchema, ContentSchemaType } from "@/lib/schemas/course-content";
import Container from "../Container";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import EditorModule from "./EditorModule";

interface Props {
    courseId: number;
    className?: string;
}

export default function ContentEditor({ courseId, className }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [deletedThemeIds, setDeletedThemeIds] = useState<number[]>([]);

    const form = useForm({
        resolver: zodResolver(ContentSchema),
        mode: "onChange",
    });

    const { fields, append, move, remove } = useFieldArray({
        name: "modules",
        control: form.control,
    });

    function appendNewModule() {
        append(
            {
                id: -1,
                fakeId: -1,
                title: "Новый модуль",
                themes: [],
            },
            {
                shouldFocus: false,
            },
        );
    }

    async function onSubmit(data: ContentSchemaType) {
        try {
            setSaving(true);

            const newModules = data.modules
                .filter((module) => !deletedIds.includes(module.id))
                .map((module) => {
                    return {
                        ...module,
                        themes: module.themes.filter(
                            (theme) => !deletedThemeIds.includes(theme.id),
                        ),
                    };
                });

            const { data: respData } = await axios.post(
                `/api/courses/${courseId}/edit-content`,
                { modules: newModules },
            );

            form.setValue(
                "modules",
                respData.map((module: any) => ({
                    id: module.id,
                    fakeId: module.id,
                    title: module.title,
                    themes: module.themes.map((theme: any) => ({
                        id: theme.id,
                        fakeId: theme.id,
                        title: theme.title,
                        imageUrl: theme.imageUrl,
                    })),
                })),
            );

            toast.success("Данные сохранены");
        } catch (e) {
            toast.error("Не удалось сохранить данные");
            console.log(e);
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true);

                const { data } = await axios.get(
                    `/api/courses/${courseId}/edit-content`,
                );

                form.setValue(
                    "modules",
                    data.map((module: any) => ({
                        id: module.id,
                        fakeId: module.id,
                        title: module.title,
                        themes: module.themes.map((theme: any) => ({
                            id: theme.id,
                            fakeId: theme.id,
                            title: theme.title,
                            imageUrl: theme.imageUrl,
                        })),
                    })),
                );
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
                {loading ? (
                    <div className="flex flex-col gap-3 items-center mt-20">
                        <Loader2 className="animate-spin" size={32} />
                        <p>Загрузка...</p>
                    </div>
                ) : (
                    <>
                        {fields.length === 0 ? (
                            <div className="flex flex-col items-center gap-10">
                                <p className="text-center max-w-lg italic text-typography-secondary">
                                    В курсе пока нет ни одной темы. <br />{" "}
                                    Создайте первый модуль, чтобы добавить темы
                                </p>
                                <Button type="button" onClick={appendNewModule}>
                                    <PlusCircle /> Новый модуль
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {fields.map(({ id, fakeId, title }, i) => {
                                    return (
                                        <EditorModule
                                            key={id}
                                            courseId={courseId}
                                            deletedIds={deletedIds}
                                            deletedThemeIds={deletedThemeIds}
                                            index={i}
                                            fields={fields}
                                            move={move}
                                            remove={remove}
                                            fakeId={fakeId}
                                            form={form}
                                            setDeletedIds={setDeletedIds}
                                            setDeletedThemeIds={
                                                setDeletedThemeIds
                                            }
                                            title={title}
                                        />
                                    );
                                })}
                            </div>
                        )}
                        {fields.length > 0 && (
                            <div className="sm:pb-20">
                                <Button
                                    type="button"
                                    onClick={appendNewModule}
                                    className="mt-10"
                                >
                                    <PlusCircle />
                                    Новый модуль
                                </Button>
                            </div>
                        )}
                    </>
                )}
                <div className="h-fit save-panel fixed bg-bg-2 top-0 sm:translate-y-[calc(100dvh-100%)] left-0 right-0 shadow-[0_0px_10px_0_rgba(0,0,0,0.1)]">
                    <Container className="flex gap-4 pb-4">
                        <Button
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                            className="basis-1/2 sm:basis-0 sm:w-fit ml-auto"
                            disabled={saving || loading}
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Save />
                            )}
                            Сохранить
                        </Button>
                        <Button
                            disabled={saving || loading}
                            variant={"outline"}
                            className="basis-[calc(50%-16px)] sm:basis-0 sm:w-fit"
                            asChild
                        >
                            <Link href={`/my-courses/${courseId}/content`}>
                                К содержанию
                            </Link>
                        </Button>
                    </Container>
                </div>
            </form>
        </FormProvider>
    );
}
