import prisma from "@/prisma/prisma-client";

export type SuccessRate = {
    id: number;
    success_rate: number;
    total_solutions: number;
};

export async function getThemeCodeTasksSuccessRate(themeId: number) {
    return (await prisma.$queryRaw`
        SELECT ct.id,
        ( SELECT COUNT(*) 
                            FROM "CodeTaskSolution" AS cts 
                            JOIN "CodeTaskVariant" AS ctv 
                            ON cts."codeTaskVariantId" = ctv.id AND ctv."codeTaskId" = ct.id) as total_solutions,
        (
            CAST(
                (
                    SELECT COUNT(*) 
                    FROM "CodeTaskSolution" AS cts 
                    JOIN "CodeTaskVariant" AS ctv 
                    ON cts."codeTaskVariantId" = ctv.id AND ctv."codeTaskId" = ct.id 
                    WHERE "isSolved" = true
                ) 
                    AS FLOAT)
                /
            CAST(
                COALESCE(
                    NULLIF(
                    (
                            SELECT COUNT(*) 
                            FROM "CodeTaskSolution" AS cts 
                            JOIN "CodeTaskVariant" AS ctv 
                            ON cts."codeTaskVariantId" = ctv.id AND ctv."codeTaskId" = ct.id 
                        ), 0
                    ), 1
                )
            AS FLOAT)
        ) as success_rate
        FROM "CodeTask" AS ct 
        JOIN "Theme" AS t ON ct."themeId" = t.id 
        WHERE t.id = ${themeId};
    `) as SuccessRate[];
}

export async function getCodeTaskSuccessRate(taskId: number) {
    return (
        (await prisma.$queryRaw`
        SELECT ct.id,
        ( SELECT COUNT(*) 
                            FROM "CodeTaskSolution" AS cts 
                            JOIN "CodeTaskVariant" AS ctv 
                            ON cts."codeTaskVariantId" = ctv.id AND ctv."codeTaskId" = ct.id) as total_solutions,
        (
            CAST(
                (
                    SELECT COUNT(*) 
                    FROM "CodeTaskSolution" AS cts 
                    JOIN "CodeTaskVariant" AS ctv 
                    ON cts."codeTaskVariantId" = ctv.id AND ctv."codeTaskId" = ct.id 
                    WHERE "isSolved" = true
                ) 
                    AS FLOAT)
                /
            CAST(
                COALESCE(
                    NULLIF(
                    (
                            SELECT COUNT(*) 
                            FROM "CodeTaskSolution" AS cts 
                            JOIN "CodeTaskVariant" AS ctv 
                            ON cts."codeTaskVariantId" = ctv.id AND ctv."codeTaskId" = ct.id 
                        ), 0
                    ), 1
                )
            AS FLOAT)
        ) as success_rate
        FROM "CodeTask" AS ct 
        WHERE ct.id = ${taskId};
    `) as SuccessRate[]
    )[0];
}
