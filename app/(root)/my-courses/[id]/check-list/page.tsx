import { runCheckList } from "@/actions/runCheckList";
import CheckList from "@/components/check-list/CheckList";

import React from "react";

export default async function CheckListPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = Number((await params).id);

    const { checkOptionsPodacha, checkOptionsStructure } =
        await runCheckList(id);

    return (
        <div className="pb-10">
            <h1 className="text-3xl font-medium mb-6">Чек-лист</h1>
            <CheckList
                courseId={id}
                initialPodacha={checkOptionsPodacha}
                initialStructure={checkOptionsStructure}
            />
        </div>
    );
}
