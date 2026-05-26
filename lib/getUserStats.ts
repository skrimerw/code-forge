import prisma from "@/prisma/prisma-client";
import { ActivityData, ActivityData2, Period, RangeData } from "@/types";
import { CodeTaskSolution, TestTaskSolution } from "@prisma/client";

const monthMap = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
];

const weekDayMap = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export async function getUserStats(userId: number) {
    const totalCodeTasks = await prisma.codeTask.count({
        where: {
            theme: {
                module: {
                    course: {
                        status: "PUBLISHED",
                    },
                },
            },
        },
    });
    const totalTestTasks = await prisma.testTask.count({
        where: {
            theme: {
                module: {
                    course: {
                        status: "PUBLISHED",
                    },
                },
            },
        },
    });

    const codeTaskSolutions = await prisma.codeTaskSolution.findMany({
        where: {
            userId,
            isSolved: true,
        },
        orderBy: {
            updatedAt: "asc",
        },
    });

    let solvedCodeTasks = 0;
    let solvedCodeTasksIds: Record<number, boolean> = {};

    for (const codeSolution of codeTaskSolutions) {
        if (solvedCodeTasksIds[codeSolution.id] === undefined) {
            solvedCodeTasks++;
            solvedCodeTasksIds[codeSolution.id] = true;
        }
    }

    const testTaskSolutions = await prisma.testTaskSolution.findMany({
        where: {
            userId,
            isSolved: true,
        },
        orderBy: {
            updatedAt: "asc",
        },
    });

    let solvedTestTasks = 0;
    let solvedTestTasksIds: Record<number, boolean> = {};

    for (const testSolution of testTaskSolutions) {
        if (solvedTestTasksIds[testSolution.id] === undefined) {
            solvedTestTasks++;
            solvedTestTasksIds[testSolution.id] = true;
        }
    }

    const currentYear = new Date(Date.now()).getFullYear();
    const currentMonth = new Date(Date.now()).getMonth();
    const currentDay = new Date(Date.now()).getDate();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let monthObj: RangeData = {};

    Array.from({ length: daysInMonth }).forEach(
        (_, i) => (monthObj[i + 1] = 0),
    );

    let codeSolutionsActivityData: ActivityData = {
        all: {},
        month: monthObj,
        week: {
            Пн: 0,
            Вт: 0,
            Ср: 0,
            Чт: 0,
            Пт: 0,
            Сб: 0,
            Вс: 0,
        },
        year: {
            Янв: 0,
            Фев: 0,
            Мар: 0,
            Апр: 0,
            Май: 0,
            Июн: 0,
            Июл: 0,
            Авг: 0,
            Сен: 0,
            Окт: 0,
            Ноя: 0,
            Дек: 0,
        },
    };

    function makeActivityData(
        solutionsArr: CodeTaskSolution[] | TestTaskSolution[],
    ) {
        for (const codeSolution of solutionsArr) {
            const year = codeSolution.updatedAt.getFullYear();
            const month = codeSolution.updatedAt.getMonth();
            const day = codeSolution.updatedAt.getDate();

            codeSolutionsActivityData.all[year] =
                codeSolutionsActivityData.all[year] === undefined
                    ? 1
                    : codeSolutionsActivityData.all[year] + 1;

            if (year === currentYear) {
                codeSolutionsActivityData.year[monthMap[month]] =
                    codeSolutionsActivityData.year[monthMap[month]] ===
                    undefined
                        ? 1
                        : codeSolutionsActivityData.year[monthMap[month]] + 1;

                if (month === currentMonth) {
                    codeSolutionsActivityData.month[day] =
                        codeSolutionsActivityData.month[day] === undefined
                            ? 1
                            : codeSolutionsActivityData.month[day] + 1;

                    const now = Date.now();
                    const weekDay = new Date(now).getDay();
                    const normalizedWeekDay = weekDay === 0 ? 6 : weekDay - 1;
                    const leftDate = new Date(
                        now - normalizedWeekDay * 24 * 60 * 60 * 1000,
                    );
                    const rightDate = new Date(
                        now + (6 - normalizedWeekDay) * 24 * 60 * 60 * 1000,
                    );

                    if (
                        currentDay >= leftDate.getDate() &&
                        currentDay <= rightDate.getDate()
                    ) {
                        codeSolutionsActivityData.week[
                            weekDayMap[normalizedWeekDay]
                        ] =
                            codeSolutionsActivityData.week[
                                weekDayMap[normalizedWeekDay]
                            ] === undefined
                                ? 1
                                : codeSolutionsActivityData.week[
                                      weekDayMap[normalizedWeekDay]
                                  ] + 1;
                    }
                }
            }
        }
    }

    makeActivityData(codeTaskSolutions);
    makeActivityData(testTaskSolutions);

    let formattedActivityData: ActivityData2 = {
        year: [],
        all: [],
        month: [],
        week: [],
    };

    function formatPeriod(rangeKey: Period) {
        formattedActivityData[rangeKey] = [
            ...Object.keys(codeSolutionsActivityData[rangeKey]).map((key) => ({
                date: key,
                count: codeSolutionsActivityData[rangeKey][key],
            })),
        ];
    }

    formatPeriod("all");
    formatPeriod("month");
    formatPeriod("week");
    formatPeriod("year");

    return {
        totalPercent:
            ((solvedCodeTasks + solvedTestTasks) * 100) /
            (totalCodeTasks + totalTestTasks),
        solvedTotal: solvedCodeTasks + solvedTestTasks,
        totalTasks: totalCodeTasks + totalTestTasks,
        testsPercent: (solvedTestTasks * 100) / totalTestTasks,
        solvedTests: solvedTestTasks,
        totalTests: totalTestTasks,
        codingPercent: (solvedCodeTasks * 100) / totalCodeTasks,
        solvedCoding: solvedCodeTasks,
        totalCoding: totalCodeTasks,
        activityData: formattedActivityData,
    };
}
