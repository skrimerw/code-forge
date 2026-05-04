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
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

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
            <div className="flex items-center gap-3">
                <div className="size-16 rounded-md overflow-hidden object-cover">
                    <img
                        src={
                            imageUrl ||
                            "https://stepik.org/static/frontend/course_cover.png"
                        }
                        className="size-full"
                    />
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
                        Все уроки из этого курса будут безвозвратно удалены
                    </p>
                    <DialogFooter>
                        <Button disabled={loading} variant={"outline"}>
                            Отмена
                        </Button>
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
