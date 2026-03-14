import React, { useEffect, useId, useRef } from "react";
import lottie from "lottie-web";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export default function Failed({ className }: Props) {
    const firstTime = useRef(true);
    const id = useId();

    useEffect(() => {
        if (firstTime.current) {
            setTimeout(() => {
                const ref = document.getElementById(id);

                if (ref) {
                    lottie.loadAnimation({
                        container: ref,
                        renderer: "svg",
                        loop: false,
                        autoplay: true,
                        path: "/lottie/Failed.json",
                    });
                }
            });
        }

        firstTime.current = false;
    }, []);

    return (
        <div
            id={id}
            className={cn("lottie [&>svg]:h-[80px]!", className)}
        ></div>
    );
}
