import { runCheckList } from "@/actions/runCheckList";
import CheckList from "@/components/check-list/CheckList";
import OpenSheet from "@/components/my-courses/OpenSheet";

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
        <div>
            <h1 className="text-3xl font-medium mb-4">
                <OpenSheet className="mr-2" />
                Чек-лист
            </h1>
            <CheckList
                courseId={id}
                initialPodacha={checkOptionsPodacha}
                initialStructure={checkOptionsStructure}
            />
        </div>
    );
}
