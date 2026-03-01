import { arraysArticle } from "./constants";
import prisma from "./prisma-client";
import bcrypt from "bcrypt";

async function up() {
    await prisma.user.create({
        data: {
            email: "user@test.ru",
            password: bcrypt.hashSync("111111", 10),
        },
    });

    await prisma.module.create({
        data: {
            title: "Знакомство с алгоритмами",
            order: 1,
        },
    });

    await prisma.theme.create({
        data: {
            moduleId: 1,
            title: "Массивы и связные списки",
            description:
                "Сортировки упорядочивают данные, обеспечивая более быстрый поиск и эффективную работу алгоритмов, лежащих в основе многих цифровых систем",
            order: 1,
            imageUrl: "/img/Array.png",
            content: arraysArticle,
            slug: "arrays-and-lists",
        },
    });

    await prisma.codeTask.create({
        data: {
            title: "Поиск наибольшего числа",
            difficulty: "EASY",
            description: `Напишите программу, которая ищет наибольшее число в массиве.`,
            themeId: 1,
            slug: "biggest-number",
        },
    });
}

async function down() {
    await prisma.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "Theme" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "Module" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "CodeTask" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.log(e);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    });
