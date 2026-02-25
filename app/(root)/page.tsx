import Container from "@/components/Container";
import ThemeCard from "@/components/ThemeCard";
import prisma from "@/prisma/prisma-client";

export default async function Home() {
    const modules = await prisma.module.findMany({
        orderBy: {
            order: "asc",
        },
        include: {
            themes: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });

    return (
        <Container className="py-16">
            <div className="max-w-3xl mb-10">
                <h1 className="font-semibold text-4xl mb-2">
                    Темы для изучения
                </h1>
                <p className="text-typography-secondary">
                    Всё, что нужно знать о структурах данных и алгоритмах.
                    Списки, деревья, сортировки, графы и многое другое — от
                    основ до продвинутого уровня. Подойдёт для учёбы, практики и
                    подготовки к собеседованиям.
                </p>
            </div>

            {modules.map(({ id, themes, title }) => {
                return (
                    <section key={id}>
                        <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
                        <div className="flex gap-5">
                            {themes.map(
                                ({
                                    id,
                                    description,
                                    slug,
                                    title,
                                    imageUrl,
                                }) => {
                                    return (
                                        <ThemeCard
                                            key={id}
                                            slug={slug}
                                            description={description}
                                            imageUrl={imageUrl}
                                            progress={16}
                                            title={title}
                                        />
                                    );
                                },
                            )}
                        </div>
                    </section>
                );
            })}
        </Container>
    );
}
