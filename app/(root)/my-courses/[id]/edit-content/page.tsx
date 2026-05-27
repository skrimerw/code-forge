import ContentEditor from "@/components/my-courses/ContentEditor";
import OpenSheet from "@/components/my-courses/OpenSheet";
import { notFound } from "next/navigation";
import React from "react";

export default async function EditContentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    if (isNaN(Number(id))) {
        notFound();
    }

    return (
        <div>
            <h1 className="mt-20 sm:mt-0 text-3xl font-medium mb-4 sm:mb-6">
                <OpenSheet className="mr-2" />
                Программа курса
            </h1>
            <ContentEditor courseId={Number(id)} />
        </div>
    );
}
