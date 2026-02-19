import CodeEditorWrapper from "@/components/CodeEditorWrapper";
import DifficultyBadge from "@/components/DifficultyBadge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export default function CodeEditorPage() {
    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList className="gap-1!">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="text-base">
                                Темы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/theory" className="text-base">
                                Массивы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-base">
                            Поиск наибольшего числа
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="my-10 flex items-center gap-4">
                <DifficultyBadge
                    className="text-base border-2 px-3"
                    difficulty="EASY"
                />
                <h1 className="text-3xl font-semibold">
                    Поиск наибольшего элемента
                </h1>
            </div>

            <CodeEditorWrapper />
        </div>
    );
}
