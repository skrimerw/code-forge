"use client";

import { useTheme } from "@/contexts/useTheme";
import { cn } from "@/lib/utils";
import { Period } from "@/types";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: { date: string; count: number }[];
    className?: string;
}

export default function ActivityChart({ data, className }: Props) {
    const { theme } = useTheme();

    function declensionTasks(count: number): string {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return "задач";
        }
        if (lastDigit === 1) {
            return "задача";
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return "задачи";
        }
        return "задач";
    }

    return (
        <div className={cn(className)}>
            <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                    <BarChart
                        width={"100%"}
                        height={"100%"}
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            tickLine={false}
                            interval="equidistantPreserveStart"
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor:
                                    theme === "dark" ? "#1f2937" : "#fff",
                                borderColor:
                                    theme === "dark" ? "#374151" : "#e5e7eb",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            formatter={(value) => [
                                `${value} ${declensionTasks(Number(value))}`,
                                "Решено",
                            ]}
                            labelFormatter={(label) => `Период: ${label}`}
                        />
                        <Bar
                            dataKey="count"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={80}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
