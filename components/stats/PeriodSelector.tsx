import { cn } from "@/lib/utils";
import { Period } from "@/types";

interface Props {
    period: Period;
    setPeriod: (p: Period) => void;
    className?: string;
}

export default function PeriodSelector({ period, setPeriod, className }: Props) {
    const buttons: { label: string; value: Period }[] = [
        { label: "Неделя", value: "week" },
        { label: "Месяц", value: "month" },
        { label: "Год", value: "year" },
        { label: "Всё время", value: "all" },
    ];

    return (
        <div className={cn("flex gap-2 mb-4", className)}>
            {buttons.map((btn) => (
                <button
                    key={btn.value}
                    onClick={() => setPeriod(btn.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        period === btn.value
                            ? "bg-blue-500 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
}
