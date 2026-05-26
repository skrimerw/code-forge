import ContentEditor from "@/components/my-courses/ContentEditor";
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
            <h1 className="text-3xl font-medium mb-6">Программа курса</h1>
            <ContentEditor courseId={Number(id)} />
        </div>
    );
}
