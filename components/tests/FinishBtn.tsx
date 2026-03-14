import React from "react";
import { Button } from "../ui/button";
import { useTestTask } from "./context/useTestTask";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
    className?: string;
}

export default function FinishBtn({ className }: Props) {
    const {
        userAnswers,
        testBody,
        setResult,
        setLoadingResult,
        loadingResult,
        testId,
    } = useTestTask();

    const totalSteps = testBody.length;

    async function finishTest() {
        try {
            setLoadingResult(true);

            const { data } = await axios.post(`/api/test/${testId}`, {
                answers: userAnswers,
            });

            setResult({ score: data.result.score });
        } catch (e) {
            console.log(e);

            toast.error("Ошибка при обработке ваших ответов");
        } finally {
            setLoadingResult(false);
        }
    }

    return (
        <Button
            onClick={finishTest}
            className={cn("px-5", className)}
            disabled={
                Object.keys(userAnswers).length !== totalSteps || loadingResult
            }
        >
            <div className="relative">
                <span
                    className={cn(
                        "absolute opacity-0 -left-2.5 top-1/2 -translate-y-1/2 invisible transition-opacity duration-300",
                        loadingResult && "opacity-100 visible",
                    )}
                >
                    <Loader2 className="animate-spin" />
                </span>
            </div>
            <span
                className={cn(
                    "transition-transform duration-300",
                    loadingResult && "translate-x-2",
                )}
            >
                Завершить
            </span>
        </Button>
    );
}
