"use client";

import React, { useState } from "react";
import { Edit, Loader2, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import Status from "@/components/my-courses/Status";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import axios from "axios";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import CourseCover from "../icons/CourseCover";

interface Props {
    course: Course;
    className?: string;
}

export default function CourseCard({
    course: { id, imageUrl, status, title },
    className,
}: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function deleteCourse() {
        try {
            setLoading(true);
            await axios.delete(`/api/courses/${id}`);
            router.refresh();
            toast.success(`Курс «${title}» удален`);
        } catch (e) {
            console.log(e);
            toast.error("Не удалось удалить курс");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            key={id}
            className={cn(
                "relative group flex p-2 bg-bg-2 rounded-md border border-input shadow-xs hover:shadow-sm transition-all duration-150",
                className,
            )}
        >
            <Link href={`/my-courses/${id}`} className="absolute inset-0 z-0" />
            <div className="flex items-center gap-3 w-full">
                <div className="flex items-center size-16 rounded-md overflow-hidden object-cover">
                    {imageUrl ? (
                        <img
                            className="object-cover size-full"
                            src={imageUrl}
                            alt="Preview"
                        />
                    ) : (
                        <CourseCover />
                    )}
                </div>
                <div className="flex flex-col mb-2">
                    <Link
                        href={`/my-courses/${id}`}
                        className="font-medium hover:underline hover:opacity-60 z-10 relative mb-1.5"
                    >
                        {title}
                    </Link>
                    <Status status={status} />
                </div>
                <div className="flex gap-3 mt-auto ml-auto text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <Link
                        className="relative z-1 hover:underline text-blue-500 dark:text-blue-500/80"
                        href={`/my-courses/${id}`}
                    >
                        Описание
                    </Link>
                    <Link
                        className="relative z-1 hover:underline text-blue-500 dark:text-blue-500/80"
                        href={`/my-courses/${id}/content`}
                    >
                        Содержание
                    </Link>
                </div>
            </div>
            <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto z-10" asChild>
                        <Button
                            variant={"ghost"}
                            className="size-7 p-0 text-foreground/50 hover:text-foreground"
                        >
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/my-courses/${id}`}>
                                <Edit className="text-foreground" />
                                Редактировать
                            </Link>
                        </DropdownMenuItem>
                        <DialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500 hover:text-red-500! focus:text-red-500! hover:bg-red-500/5! focus:bg-red-500/5!">
                                <Trash2 className="text-red-500 hover:text-red-500!" />
                                Удалить
                            </DropdownMenuItem>
                        </DialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DialogTitle />
                <DialogDescription />
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <h2 className="text-xl font-semibold">
                            Удалить курс «{title}»?
                        </h2>
                    </DialogHeader>
                    <p className="mb-6">
                        Все темы из этого курса будут безвозвратно удалены
                    </p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={loading} variant={"outline"}>
                                Отмена
                            </Button>
                        </DialogClose>
                        <Button disabled={loading} onClick={deleteCourse}>
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Trash2 />
                            )}
                            Удалить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
