"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function CacheHandler() {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
        const handlePageShow = (event: any) => {};

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    return <></>;
}
