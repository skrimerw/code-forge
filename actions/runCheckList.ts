"use server";

import { CheckOptionProps } from "@/components/check-list/CheckOption";
import prisma from "@/prisma/prisma-client";

type PodachaKeys = "no_logo" | "description" | "no_themes_logo";
type StructureKeys =
    | "modules"
    | "themes"
    | "tasks"
    | "empty_modules"
    | "empty_titles"
    | "no_boilerplate"
    | "empty_themes";

export type PodachaCheckList = Record<PodachaKeys, CheckOptionProps>;
export type StructureCheckList = Record<StructureKeys, CheckOptionProps>;

export async function runCheckList(id: number) {
    const course = await prisma.course.findFirst({
        where: {
            id,
        },
    });

    const modules = await prisma.module.findMany({
        where: {
            courseId: id,
        },
    });

    const themes = await prisma.theme.findMany({
        where: {
            module: {
                courseId: id,
            },
        },
    });

    const codeTasks = await prisma.codeTask.findMany({
        where: {
            theme: {
                module: {
                    courseId: id,
                },
            },
        },
        include: {
            variants: true,
        },
    });

    const testTasks = await prisma.testTask.findMany({
        where: {
            theme: {
                module: {
                    courseId: id,
                },
            },
        },
    });

    const checkOptionsStructure: StructureCheckList = {
        modules: {
            title: "Больше 1 модуля",
            description:
                "Разбейте курс хотя бы на два модуля, чтобы структурировать содержание. Исходите из того, что учащиеся осваивают материалы модуля в течение недели.",
            isValid: false,
            link: `/my-courses/${id}/edit-content`,
            linkLabel: "Добавить модуль",
        },
        themes: {
            title: "Больше 9 тем (сейчас 1)",
            description:
                "Хорошо, когда тему можно пройти за один «присест», за 15-30 минут. Мы считаем, что в курсе стоит сделать не менее десяти тем.",
            isValid: false,
            link: `/my-courses/${id}/edit-content`,
            linkLabel: "Добавить тему",
        },
        tasks: {
            title: "Больше 9 задач (сейчас 1)",
            description:
                "Мы верим в обучение через практику, через решение задач. Рекомендуем сделать не менее десяти задач в вашем курсе.",
            isValid: false,
            link: `/my-courses/${id}/content`,
            linkLabel: "К содержанию",
        },
        empty_modules: {
            title: "Есть пустые модули",
            description:
                "В каждом модуле должна быть хотя бы одна тема, иначе курс выглядит недоделанным. Удалите пустые модули или заполните их темами.",
            isValid: false,
            link: `/my-courses/${id}/edit-content`,
            linkLabel: "Редактировать содержание",
        },
        empty_themes: {
            title: "Есть темы без заданий",
            description: "В каждой теме быть хотя бы одна задача.",
            isValid: false,
            link: `/my-courses/${id}/edit-content`,
            linkLabel: "Редактировать темы",
        },
        empty_titles: {
            title: "У модулей и тем содержательные названия",
            description:
                "Замените стандартные названия модулей «Новый модуль» или «New module» на говорящие.",
            isValid: false,
            link: `/my-courses/${id}/edit-content`,
            linkLabel: "Переименовать модули",
        },
        no_boilerplate: {
            title: "Нет шаблонных текстов и задач",
            description:
                "Когда вы создаёте шаг, мы добавляем начальный текст для вашего удобства. Обязательно замените его на авторский материал, чтобы ваш курс был уникальным и более ценным для учащихся.",
            isValid: false,
            link: `/my-courses/${id}/content`,
            linkLabel: "Проверить",
        },
    };

    const checkOptionsPodacha: PodachaCheckList = {
        no_logo: {
            title: "Есть логотип у курса",
            description:
                "Первое, что видят учащиеся в каталоге, — логотип вашего курса.",
            isValid: false,
            link: `/my-courses/${id}/description`,
            linkLabel: "Загрузить логотип",
        },
        no_themes_logo: {
            title: "Есть логотипы у тем",
            description: "У всех тем должны быть логотипы.",
            isValid: false,
            link: `/my-courses/${id}/edit-content`,
            linkLabel: "Загрузить логотип",
        },
        description: {
            title: "Краткое описание длиннее 100 символов",
            description:
                "Попробуйте ёмко выразить, о чём ваш курс. Это описание учащиеся увидят в поиске и на промостранице сразу после названия курса.",
            isValid: false,
            link: `/my-courses/${id}/description`,
            linkLabel: "Заполнить описание",
        },
    };

    if (modules.length > 1) {
        checkOptionsStructure.modules.isValid = true;
    }

    if (themes.length > 9) {
        checkOptionsStructure.themes.isValid = true;
    }
    checkOptionsStructure.themes.title = `Больше 9 тем (сейчас ${themes.length})`;

    const totalTasksCount = testTasks.length + codeTasks.length;

    if (totalTasksCount > 9) {
        checkOptionsStructure.tasks.isValid = true;
    }

    checkOptionsStructure.tasks.title = `Больше 9 задач (сейчас ${totalTasksCount})`;

    const nonEmptyModules = new Set(themes.map((theme) => theme.moduleId));

    if (nonEmptyModules.size === modules.length) {
        checkOptionsStructure.empty_modules.isValid = true;
    }

    const nonEmptyThemes = new Set([
        ...testTasks.map((task) => task.themeId),
        ...codeTasks.map((task) => task.themeId),
    ]);

    if (nonEmptyThemes.size === themes.length) {
        checkOptionsStructure.empty_themes.isValid = true;
    }

    const templateTitleModules = modules.find((module) =>
        ["новый модуль", "new module", ""].includes(module.title.trim()),
    );

    const templateTitleThemes = themes.find((theme) =>
        ["новая тема", "new theme", ""].includes(theme.title.trim()),
    );

    if (!templateTitleModules && !templateTitleThemes) {
        checkOptionsStructure.empty_titles.isValid = true;
    }

    const emptyTheme = themes.find(
        (theme) => theme.content.trim() === "" || theme.content.trim() === "",
    );
    const emptyCodeTask = codeTasks.find(
        (task) =>
            task.description.trim() === "" ||
            task.title.trim() === "" ||
            task.variants.find(
                (variant) =>
                    variant.test.trim() === "" ||
                    variant.starterCode.trim() === "",
            ),
    );
    const emptyTestTask = testTasks.find((task) => task.title.trim() === "");

    if (!emptyTheme && !emptyCodeTask && !emptyTestTask) {
        checkOptionsStructure.no_boilerplate.isValid = true;
    }

    if (course?.imageUrl?.trim()) {
        checkOptionsPodacha.no_logo.isValid = true;
    }

    const noLogoTheme = themes.find((theme) => theme.imageUrl.trim() === "");

    if (!noLogoTheme) {
        checkOptionsPodacha.no_themes_logo.isValid = true;
    }

    if (course?.description && course.description.length > 100) {
        checkOptionsPodacha.description.isValid = true;
    }

    return { checkOptionsStructure, checkOptionsPodacha };
}
