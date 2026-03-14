import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { useTestTask } from "./context/useTestTask";

interface Props {
    className?: string;
}

export default function NextBtn({ className }: Props) {
    const { step, setStep, userAnswers, testBody } = useTestTask();

    const totalSteps = testBody.length;
    const { id: questionId } = testBody[step - 1];

    const isAnswersChosen = useMemo(() => {
        return Object.keys(userAnswers).includes(String(questionId));
    }, [userAnswers, step]);

    function nextStep() {
        setStep(step + 1);
    }
    return (
        step !== totalSteps && (
            <Button
                className={className}
                onClick={nextStep}
                disabled={!isAnswersChosen}
            >
                Далее <ChevronRight />
            </Button>
        )
    );
}
