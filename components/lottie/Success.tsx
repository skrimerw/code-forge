import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
}

export default function Success({ className }: Props) {
    const firstTime = useRef(true);

    useEffect(() => {
        if (firstTime.current) {
            setTimeout(() => {
                const ref = document.querySelector(".lottie");

                if (ref) {
                    lottie.loadAnimation({
                        container: ref,
                        renderer: "svg",
                        loop: false,
                        autoplay: true,
                        path: "/lottie/Checkmark.json",
                    });
                }
            });
        }

        firstTime.current = false;
    }, []);

    return <div className={cn("lottie [&>svg]:h-[130px]! mb-2", className)}></div>;
}
