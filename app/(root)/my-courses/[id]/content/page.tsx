import ContentFirstLevel from "@/components/my-courses/ContentFirstLevel";
import OpenSheet from "@/components/my-courses/OpenSheet";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma/prisma-client";
import Link from "next/link";
import React from "react";

export default async function ContentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const courseId = (await params).id;
    const content = await prisma.module.findMany({
        where: {
            courseId: Number(courseId),
        },
        include: {
            themes: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return (
        <div>
            <h1 className="text-3xl font-medium mb-4">
                <OpenSheet className="mr-2" />
                Программа курса
            </h1>
            {content.length === 0 ? (
                <>
                    <p className="mb-6">
                        В курсе пока что нет ни одной темы. <br /> Добавьте свою
                        первую тему в редакторе содержания курса.
                    </p>
                    <Button asChild>
                        <Link href={`/my-courses/${courseId}/edit-content`}>
                            Редактировать содержимое
                        </Link>
                    </Button>
                </>
            ) : (
                <>
                    <Button className="mb-8" asChild>
                        <Link href={`/my-courses/${courseId}/edit-content`}>
                            Редактировать содержимое
                        </Link>
                    </Button>
                    <div className="space-y-5">
                        {content.map((module) => {
                            const { id, themes } = module;
                            return (
                                <ContentFirstLevel
                                    key={id}
                                    courseId={Number(courseId)}
                                    module={module}
                                    themes={themes}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
