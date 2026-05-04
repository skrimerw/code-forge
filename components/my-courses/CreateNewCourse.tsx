"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CreateCourseSchema, CreateCourseType } from "@/lib/schemas/course";
import { Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

interface Props {
    className?: string;
}

export default function CreateNewCourse({ className }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CreateCourseSchema),
        defaultValues: {
            title: "",
        },
    });

    async function onSubmit(data: CreateCourseType) {
        try {
            setLoading(true);

            const { data: resp } = await axios.post("/api/courses/new", data);

            router.prefetch(`/my-courses/${resp.id}`);
            router.push(`/my-courses/${resp.id}`);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) {
                    form.reset();
                }
            }}
        >
            <DialogTrigger asChild className={className}>
                <Button>
                    <PlusCircle />
                    Создать курс
                </Button>
            </DialogTrigger>
            <DialogTitle className="size-0! absolute" />
            <DialogDescription className="size-0! absolute" />
            <DialogContent>
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormInput
                            name="title"
                            label="Название курса"
                            required
                        />
                        <Button className="gap-0 w-fit px-8" disabled={loading}>
                            <div className="relative">
                                <span
                                    className={cn(
                                        "absolute opacity-0 -left-2.5 top-1/2 -translate-y-1/2 invisible transition-opacity duration-300",
                                        loading && "opacity-100 visible",
                                    )}
                                >
                                    <Loader2 className="animate-spin" />
                                </span>
                            </div>
                            <span
                                className={cn(
                                    "transition-transform duration-300",
                                    loading && "translate-x-4",
                                )}
                            >
                                Создать курс
                            </span>
                        </Button>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
