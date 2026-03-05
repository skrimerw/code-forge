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
            variants: {
                create: [
                    {
                        starterCode: "function maxVal(arr) {\n\t//место для вашего кода\n\t\n}",
                        lang: "JAVASCRIPT",
                        test: `
                                import { config, assert } from "chai";

                                config.truncateThreshold = 0;

                                describe("Test", () => {
                                    it("middle", () => {
                                        assert.strictEqual(maxVal([1,23]), 23);
                                        assert.strictEqual(maxVal([1,-3, -23]), 1);
                                    });
                                });

                                describe("random tests", () => {
                                    it("middle", () => {
                                        assert.strictEqual(maxVal([1,23]), 23);
                                        assert.strictEqual(maxVal([1,-3, 3]), 3);
                                    });
                                });
                            `,
                    },
                ],
            },
        },
    });
}

async function down() {
    await prisma.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "Theme" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "Module" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "CodeTask" RESTART IDENTITY CASCADE`;
    await prisma.$queryRaw`TRUNCATE TABLE "CodeTaskVariant" RESTART IDENTITY CASCADE`;
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
