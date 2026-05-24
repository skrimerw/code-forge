import prisma from "@/prisma/prisma-client";
import { SuccessRate } from "./success-rate-code-tasks";

export async function getThemeTestTasksSuccessRate(themeId: number) {
    return (await prisma.$queryRaw`
        SELECT tt.id, 
        ( SELECT COUNT(*) 
                            FROM "TestTaskSolution" AS tts 
                            WHERE tts."testTaskId" = tt.id) as total_solutions,
        (
            CAST(
                (
                    SELECT COUNT(*) 
                    FROM "TestTaskSolution" AS tts 
                    WHERE tts."testTaskId" = tt.id
                    AND "isSolved" = true
                ) 
                    AS FLOAT)
                /
            CAST(
                COALESCE(
                    NULLIF(
                    (
                            SELECT COUNT(*)
                            FROM "TestTaskSolution" AS tts 
                            WHERE tts."testTaskId" = tt.id
                        ), 0
                    ), 1
                )
            AS FLOAT)
        ) as success_rate
       
        FROM "TestTask" AS tt 
        JOIN "Theme" AS t ON tt."themeId" = t.id 
        WHERE t.id = ${themeId};
    `) as SuccessRate[];
}
