import { useCodeEditor } from "@/contexts/useCodeEditor";
import React, { useEffect, useMemo, useRef } from "react";
import OutputCollapsible from "./OutputCollapsible";
import { cn, hasTestsPassed } from "@/lib/utils";
import TestCollapsible from "./TestCollapsible";
import { CircleAlert } from "lucide-react";
import { useSuccessModal } from "@/contexts/useSuccessModal";
import { toast } from "react-toastify";

interface Props {
    className?: string;
}

export default function Output({ className }: Props) {
    const { output } = useCodeEditor();
    const { setOpen, isSolved, setIsSolved } = useSuccessModal();
    const firstRender = useRef(true);

    const allTestsPassed = useMemo(() => {
        if (output?.tests === undefined || output?.tests.length === 0)
            return false;

        const hasPassed = hasTestsPassed(output?.tests || []);

        return hasPassed;
    }, [output]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (allTestsPassed && !isSolved) {
            setOpen(true);
            setIsSolved(true);

            return
        }

        if (allTestsPassed) {
            toast.success("Задание выполнено! 🎉");
        }
    }, [output, allTestsPassed]);

    return (
        <div
            className={cn(
                "border-2 h-full rounded-md transition-colors overflow-auto",
                output?.code === 1 && "border-error",
                allTestsPassed && "border-easy-foreground",
                className,
            )}
        >
            {output === null ? (
                <p className="px-4 py-2">
                    Здесь будет показан результат работы вашего кода
                </p>
            ) : (
                <div className="flex flex-col">
                    <header className="flex border-b p-4 py-3 text-sm font-medium gap-3">
                        {output.timedOut ? (
                            <span className="text-error">Timed Out</span>
                        ) : (
                            <span>Time: {output.time}ms</span>
                        )}
                        <span
                            className={
                                output.code === 1
                                    ? "text-error"
                                    : "text-easy-foreground"
                            }
                        >
                            Exit code: {output.code}
                        </span>
                    </header>
                    <div className="flex flex-col gap-4 p-4 font-geist-mono">
                        {output.stdout && (
                            <OutputCollapsible
                                title="STDOUT"
                                content={output.stdout}
                            />
                        )}

                        {output.stderr && (
                            <OutputCollapsible
                                title="STDERR"
                                content={output.stderr}
                            />
                        )}

                        {output.tests?.length > 0 && (
                            <div className="text-sm font-geist-sans font-medium">
                                <h2
                                    className={cn(
                                        "flex items-center gap-2 border-l-[5px] border-error leading pl-2",
                                        allTestsPassed &&
                                            "border-easy-foreground",
                                    )}
                                >
                                    Test Results:
                                </h2>
                                <div className="mt-4">
                                    {output.tests.map((suite, i) => {
                                        return (
                                            <TestCollapsible
                                                key={i}
                                                title={suite.title}
                                                isPassed={hasTestsPassed([
                                                    suite,
                                                ])}
                                            >
                                                {suite.tests.map(
                                                    (
                                                        {
                                                            status,
                                                            title,
                                                            duration,
                                                            err,
                                                            logs,
                                                        },
                                                        i,
                                                    ) => {
                                                        return (
                                                            <TestCollapsible
                                                                key={i}
                                                                title={title}
                                                                isPassed={
                                                                    status ===
                                                                    "failed"
                                                                        ? false
                                                                        : true
                                                                }
                                                            >
                                                                <div className="flex flex-col gap-2.5">
                                                                    {logs.length >
                                                                        0 && (
                                                                        <OutputCollapsible
                                                                            title="STDOUT"
                                                                            content={logs.join(
                                                                                "\n",
                                                                            )}
                                                                        />
                                                                    )}
                                                                    {err !==
                                                                        null &&
                                                                        (err?.ok ===
                                                                        undefined ? (
                                                                            <OutputCollapsible
                                                                                title="STDERR"
                                                                                content={
                                                                                    err?.stack as string
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <p
                                                                                className={cn(
                                                                                    "flex items-center gap-1.5",
                                                                                    status ===
                                                                                        "failed"
                                                                                        ? "text-error"
                                                                                        : "text-easy-foreground",
                                                                                )}
                                                                            >
                                                                                <CircleAlert
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                {
                                                                                    err?.message
                                                                                }
                                                                            </p>
                                                                        ))}
                                                                    <p className="text-xs text-typography-secondary font-bold">
                                                                        Completed
                                                                        in{" "}
                                                                        {
                                                                            duration
                                                                        }{" "}
                                                                        ms
                                                                    </p>
                                                                </div>
                                                            </TestCollapsible>
                                                        );
                                                    },
                                                )}
                                            </TestCollapsible>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {output.timedOut && (
                            <div className="font-geist-sans rounded-sm border-2 border-dashed p-2 border-foreground">
                                <h3 className="text-sm font-semibold mb-1">
                                    Почему ваш код не успел выполниться?
                                </h3>
                                <p className="text-xs">
                                    Наши серверы настроены так, чтобы
                                    ограничивать время выполнения вашего кода. В
                                    редких случаях сервер может быть перегружен
                                    задачами и не успеть обработать ваш код
                                    достаточно быстро. Однако чаще всего эта
                                    проблема связана с неэффективными
                                    алгоритмами. Если вы сталкиваетесь с этой
                                    ошибкой регулярно, рекомендуется
                                    дополнительно оптимизировать код.
                                </p>
                            </div>
                        )}

                        {allTestsPassed && (
                            <div className="font-geist-sans rounded-sm border-2 border-dashed p-3 border-easy-foreground mt-5">
                                <p className="text-sm font-medium text-easy-foreground">
                                    Вы прошли все тесты! :)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
