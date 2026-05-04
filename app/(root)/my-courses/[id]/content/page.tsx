import React from "react";

export default async function ContentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return <div>page</div>;
}
