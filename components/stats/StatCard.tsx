import { cn } from "@/lib/utils";

interface Props {
    title: string;
    value: string | number;
    solved?: number;
    total?: number;
    color?: "blue" | "green" | "purple";
    className?: string;
}

export default function StatCard({
    title,
    value,
    solved,
    total,
    color = "blue",
    className,
}: Props) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
    };

    const bgClasses = {
        blue: "bg-blue-50 dark:bg-blue-900/20",
        green: "bg-green-50 dark:bg-green-900/20",
        purple: "bg-purple-50 dark:bg-purple-900/20",
    };

    function declensionAssignments(count: number): string {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return "заданий";
        }
        if (lastDigit === 1) {
            return "задания";
        }
        return "заданий";
    }

    return (
        <div
            className={cn(
                `relative ${bgClasses[color]} overflow-hidden rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md`,
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </div>
                    <div
                        className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mt-1`}
                    >
                        {value}
                    </div>
                    {solved !== undefined && total !== undefined && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span className="font-medium">{solved}</span>
                            <span className="text-gray-400"> / </span>
                            <span>{total}</span>
                            <span className="text-gray-400 ml-1">
                                {declensionAssignments(total)}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`absolute -top-8 -right-8 rounded-full flex items-center justify-center`}
                >
                    {color === "blue" && (
                        <svg
                            className="w-32 h-32 text-blue-500/20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    )}
                    {color === "green" && (
                        <svg
                            className="w-32 h-32 text-green-500/20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                    {color === "purple" && (
                        <svg
                            className="w-32 h-32 text-purple-500/20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
}
