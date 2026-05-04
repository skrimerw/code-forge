"use client";

import React, { useState } from "react";
import StatCard from "./StatCard";
import ActivityChart from "./ActivityChart";
import { Period } from "@/types";
import { cn } from "@/lib/utils";
import PeriodSelector from "./PeriodSelector";

interface ActivityData2 {
    week: { date: string; count: number }[];
    month: { date: string; count: number }[];
    year: { date: string; count: number }[];
    all: { date: string; count: number }[];
}

interface Props {
    data: {
        totalPercent: number;
        solvedTotal: number;
        totalTasks: number;
        testsPercent: number;
        solvedTests: number;
        totalTests: number;
        codingPercent: number;
        solvedCoding: number;
        totalCoding: number;
        activityData: ActivityData2;
    };
    className?: string;
}

export default function UserStatsDashboard({ data, className }: Props) {
    const [period, setPeriod] = useState<Period>("week");

    return (
        <div className={cn("min-h-screen py-6", className)}>
            <div className="mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Мой прогресс
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Отслеживайте свой прогресс и динамику
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        title="Общий прогресс"
                        value={`${data.totalPercent}%`}
                        solved={data.solvedTotal}
                        total={data.totalTasks}
                        color="blue"
                    />
                    <StatCard
                        title="Тесты"
                        value={`${data.testsPercent}%`}
                        solved={data.solvedTests}
                        total={data.totalTests}
                        color="green"
                    />
                    <StatCard
                        title="Задачи на код"
                        value={`${data.codingPercent}%`}
                        solved={data.solvedCoding}
                        total={data.totalCoding}
                        color="purple"
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Динамика решений
                    </h2>
                    <PeriodSelector period={period} setPeriod={setPeriod} />
                    <ActivityChart
                        data={data.activityData[period]}
                    />
                </div>
            </div>
        </div>
    );
}
