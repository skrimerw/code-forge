"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CodeTask } from "@prisma/client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormTextarea from "../form/FormTextarea";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { EditCodeTaskSchema, EditCodeTaskType } from "@/lib/schemas/code-task";
import Link from "next/link";
import CodeEditor from "./CodeEditor";
import DifficultyDropdown from "../DifficultyDropdown";
import OpenSheet from "../edit-lessons/OpenSheet";

interface Props {
    themeTitle: string;
    task: CodeTask;
    initialCode: string;
    testCode: string;
    className?: string;
}

export default function EditCodeTaskForm({
    themeTitle,
    task,
    initialCode,
    testCode,
    className,
}: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(EditCodeTaskSchema),
        defaultValues: {
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            initialCode: initialCode,
            testCode: testCode,
        },
    });

    async function onSubmit(data: EditCodeTaskType) {
        try {
            setLoading(true);

            await axios.post(`/api/code-task/${task.id}`, data);

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
            <div className="flex items-center mb-5">
                <OpenSheet className="mr-2" />
                <Link
                    href={".."}
                    className="flex items-center hover:underline gap-2 w-fit"
                >
                    <ArrowLeft size={18} /> {themeTitle}
                </Link>
            </div>
            <FormProvider {...form}>
                <form
                    className={cn("flex flex-col gap-4 max-w-3xl", className)}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col items-start sm:flex-row gap-4 sm:items-end w-full">
                        <FormInput
                            name="title"
                            defaultValue={task.title}
                            label="Название"
                            placeholder="Введите название"
                            className="w-full"
                        />
                        <DifficultyDropdown form={form} />
                    </div>
                    <FormTextarea
                        name="description"
                        defaultValue={task.description}
                        label="Описание"
                        placeholder="Введите описание"
                    />
                    <CodeEditor
                        name="initialCode"
                        description={
                            <p className="text-sm mb-1 text-typography-secondary">
                                Напишите код, с которого пользователь начнет
                                выполнять задание. Задания выполняются на языке{" "}
                                <span className="inline-block">
                                    <svg
                                        className="inline"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 256 256"
                                        version="1.1"
                                        preserveAspectRatio="xMidYMid"
                                    >
                                        <g>
                                            <path
                                                d="M0,0 L256,0 L256,256 L0,256 L0,0 Z"
                                                fill="#F7DF1E"
                                            ></path>
                                            <path
                                                d="M67.311746,213.932292 L86.902654,202.076241 C90.6821079,208.777346 94.1202286,214.447137 102.367086,214.447137 C110.272203,214.447137 115.256076,211.354819 115.256076,199.326883 L115.256076,117.528787 L139.313575,117.528787 L139.313575,199.666997 C139.313575,224.58433 124.707759,235.925943 103.3984,235.925943 C84.1532952,235.925943 72.9819429,225.958603 67.3113397,213.93026"
                                                fill="#000000"
                                            ></path>
                                            <path
                                                d="M152.380952,211.354413 L171.969422,200.0128 C177.125994,208.433981 183.827911,214.619835 195.684368,214.619835 C205.652521,214.619835 212.009041,209.635962 212.009041,202.762159 C212.009041,194.513676 205.479416,191.592025 194.481168,186.78207 L188.468419,184.202565 C171.111213,176.81473 159.597308,167.53534 159.597308,147.944838 C159.597308,129.901308 173.344508,116.153295 194.825752,116.153295 C210.119924,116.153295 221.117765,121.48094 229.021663,135.400432 L210.29059,147.428775 C206.166146,140.040127 201.699556,137.119289 194.826159,137.119289 C187.78047,137.119289 183.312254,141.587098 183.312254,147.428775 C183.312254,154.646349 187.78047,157.568406 198.089956,162.036622 L204.103924,164.614095 C224.553448,173.378641 236.067352,182.313448 236.067352,202.418387 C236.067352,224.071924 219.055137,235.927975 196.200432,235.927975 C173.860978,235.927975 159.425829,225.274311 152.381359,211.354413"
                                                fill="#000000"
                                            ></path>
                                        </g>
                                    </svg>
                                    <b className="ml-1">JavaScript</b>.
                                </span>
                            </p>
                        }
                        form={form}
                        label="Начальный код"
                    />
                    <CodeEditor
                        description={
                            <p className="text-sm mb-1 text-typography-secondary">
                                Добавьте тесты, чтобы проверить правильность
                                кода учащегося. Отправленное решение будет
                                проверяться на каждом тесте. Для написания
                                тестов используется библиотека{" "}
                                <a
                                    href="https://mochajs.org/"
                                    target="_blank"
                                    className="text-blue-500 hover:underline"
                                >
                                    Mocha
                                </a>{" "}
                                на языке JavaScript.
                            </p>
                        }
                        name="testCode"
                        form={form}
                        label="Тестовый код"
                    />
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
