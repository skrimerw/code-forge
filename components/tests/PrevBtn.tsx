import React from "react";
import { useTestTask } from "./context/useTestTask";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

interface Props {
    className?: string;
}

export default function PrevBtn({ className }: Props) {
    const { step, setStep } = useTestTask();

    function prevStep() {
        setStep(step - 1);
    }

    return (
        step > 1 && (
            <Button className={className} onClick={prevStep}>
                <ChevronLeft /> Назад
            </Button>
        )
    );
}
