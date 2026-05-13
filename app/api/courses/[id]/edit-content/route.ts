import { ContentSchema } from "@/lib/schemas/course-content";
import { toSlug } from "@/lib/toSlug";
import prisma from "@/prisma/prisma-client";
import { Theme } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
    _req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]">,
) {
    const id = Number((await ctx.params).id);

    const modules = await prisma.module.findMany({
        where: {
            courseId: id,
        },
        include: {
            themes: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return NextResponse.json(modules);
}

export async function POST(
    req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]">,
) {
    const body = await req.json();
    const id = Number((await ctx.params).id);

    if (isNaN(id) || id < 1) {
        return NextResponse.json(
            {
                message: "Invalid id. ID should be a number greater than 1",
            },
            { status: 400 },
        );
    }

    const { success, data, error } = ContentSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            {
                message: z.treeifyError(error),
            },
            { status: 400 },
        );
    }

    let i = 0;

    const currentModulesIds: number[] = [];
    const currentThemesIds: number[] = [];

    const oldModules = await prisma.module.findMany({
        where: {
            courseId: id,
        },
    });

    const oldThemes: Theme[] = [];

    for (const module of data.modules) {
        const upsertedModule = await prisma.module.upsert({
            where: {
                id: module.id,
            },
            create: {
                order: i + 1,
                title: module.title,
                courseId: id,
            },
            update: {
                order: i + 1,
                title: module.title,
            },
        });

        currentModulesIds.push(upsertedModule.id);

        let j = 0;

        for (const theme of module.themes) {
            const upsertedTheme = await prisma.theme.upsert({
                where: {
                    id: theme.id,
                },
                create: {
                    content: "",
                    description: "",
                    imageUrl: theme.imageUrl,
                    order: j + 1,
                    title: theme.title,
                    slug: toSlug(theme.title),
                    moduleId: upsertedModule.id,
                },
                update: {
                    imageUrl: theme.imageUrl,
                    order: j + 1,
                    title: theme.title,
                    slug: toSlug(theme.title),
                },
            });

            currentThemesIds.push(upsertedTheme.id);

            j++;
        }

        const allThemes = await prisma.theme.findMany({
            where: {
                moduleId: upsertedModule.id,
            },
        });

        oldThemes.push(...allThemes);

        i++;
    }

    const currentModulesIdsSet = new Set(currentModulesIds);
    const oldModulesIdsSet = new Set(oldModules.map((module) => module.id));

    const modulesIdsDiff = oldModulesIdsSet.difference(currentModulesIdsSet);

    for (const moduleId of modulesIdsDiff) {
        await prisma.theme.deleteMany({
            where: {
                moduleId,
            },
        });

        await prisma.module.delete({
            where: {
                id: moduleId,
            },
        });
    }

    const currentThemesIdsSet = new Set(currentThemesIds);
    const oldThemesIdsSet = new Set(oldThemes.map((theme) => theme.id));

    const themesIdsDiff = oldThemesIdsSet.difference(currentThemesIdsSet);

    for (const themeId of themesIdsDiff) {
        await prisma.theme.deleteMany({
            where: {
                id: themeId,
            },
        });
    }

    const modules = await prisma.module.findMany({
        where: {
            courseId: id,
        },
        include: {
            themes: true,
        },
    });

    return NextResponse.json(modules);
}
