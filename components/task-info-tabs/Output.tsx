import { useCodeEditor } from "@/contexts/useCodeEditor";
import React from "react";
import OutputCollapsible from "./OutputCollapsible";

interface Props {
    className?: string;
}

export default function Output({ className }: Props) {
    const { output } = useCodeEditor();

    return (
        <div className={className}>
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
                    </div>
                </div>
            )}
        </div>
    );
}
