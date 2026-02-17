import TableOfContents from "@/components/TableOfContents";
import TaskCard from "@/components/TaskCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const links = [
    {
        id: "heading_1",
        text: "Что такое массив в программировании",
    },
    {
        id: "heading_2",
        text: "Как создать массив и наполнить его данными",
    },
    {
        id: "heading_3",
        text: "Задания",
    },
];

export default function TheoryPage() {
    return (
        <div className="">
            <Breadcrumb>
                <BreadcrumbList className="gap-1!">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="text-base">
                                Темы
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="size-3" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-base">
                            Массивы
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-semibold my-10">Массивы</h1>
            <div className="flex gap-14">
                <div className="article-content">
                    <article className="article-container">
                        <section aria-label="heading_1">
                            <h2 id="heading_1">
                                Что такое массив в программировании
                            </h2>
                            <p>
                                Массив в программировании — это такая структура
                                данных, в которой одинаковые элементы выстроены
                                по порядку и доступны по номеру. Условно массивы
                                можно представить как пронумерованный набор
                                спичечных коробков, где в каждом коробке лежат
                                однотипные спички, но в разном количестве. Суть
                                в том, что массивы помогают удобно хранить
                                и обрабатывать большие объёмы данных.
                            </p>
                            <img src="/img/theory-mock/arr.png" alt="img" />
                            <p>
                                В виде массивов можно представить разные вещи
                                из окружающего нас мира: например, разложенную
                                по одинаковым контейнерам и выстроенную
                                стройными рядами черешню на лотке у уличного
                                продавца или список учеников в классном журнале.
                            </p>
                            <p>
                                Массив — это линейная структура, которая
                                позволяет хранить однотипные данные в виде
                                некоего списка, то есть последовательно, один
                                за другим. Если программисту нужно одно число,
                                он заводит переменную, а если десяток чисел
                                и больше, то он заводит массив чисел.
                            </p>
                            <p>
                                Основная функция массива как структуры данных —
                                содержать в себе данные и предоставлять к ним
                                удобный и алгоритмизуемый доступ.
                            </p>
                            <p>Выделяют три важные особенности массивов:</p>
                            <ol>
                                <li>
                                    Они всегда состоят из одинаковых элементов.
                                    Этим массивы отличаются от других структур
                                    данных. Элементами конкретного массива могут
                                    стать числа, строки или даже другие массивы.
                                </li>
                                <li>
                                    К любому элементу массива можно обратиться
                                    по его номеру, также его называют индексом.
                                    По индексу программист может быстро найти
                                    нужный элемент. Обычно индексация массивов
                                    начинается с 0. Предположим, что у нас есть
                                    массив с тремя элементами, — они будут иметь
                                    индексы 0, 1 и 2.
                                </li>
                                <li>
                                    Длина массива задаётся в момент его
                                    создания.
                                </li>
                            </ol>
                            <p>
                                Пример простого массива в JavaScript: <br /> let
                                numbers = [1, 2, 3, 4, 5];
                            </p>
                            <p>
                                Массив numbers содержит пять целых чисел.
                                По индексу numbers[0] доступно значение 1,
                                numbers[1] будет равно 2, и т. д.
                            </p>
                            <p>
                                Массивы — это довольно древняя структура данных,
                                которая используется в большинстве популярных
                                языков программирования. По сути, любая память
                                компьютера представляет собой массив. Поэтому
                                в основном, когда говорят о массивах,
                                подразумевают низкоуровневую работу с памятью
                                в виде удобной структуры данных.
                            </p>
                            <p>
                                Научиться находить элементы в массивах
                                на продвинутом уровне, писать эффективный код
                                и выбирать подходящие структуры под конкретную
                                задачу поможет курс «Алгоритмы и структуры
                                данных». Для успешного прохождения важно знать
                                один из языков программирования и разбираться
                                в базовой математике уровня старших классов.
                                Понять, подходит ли вам курс, можно, пройдя
                                бесплатный первый модуль.
                            </p>
                        </section>
                        <section aria-label="heading_2">
                            <h2 id="heading_2">
                                Как создать массив и наполнить его данными
                            </h2>
                            <p>
                                Обычно программисты не создают массивы, а просто
                                объявляют их, и они сразу готовы к работе: так
                                устроена эта низкоуровневая структура данных.
                                При объявлении массива компилятор в памяти
                                компьютера размечает упорядоченными областями
                                данные, которые соответствуют каждой ячейке
                                массива.
                            </p>
                            <p>
                                Длина массивов задаётся заранее: создать можно
                                только массив с конкретной длиной. Программист
                                или задаёт эту длину в переменной, или создаёт
                                её через конструкцию типа new. С этого момента
                                массив сразу готов к работе, можно записывать
                                в любую ячейку нужные значения.
                            </p>
                            <p>
                                Приведём простые примеры создания массивов
                                в разных языках.
                            </p>
                            <img src="/img/theory-mock/image 1.png" alt="img" />
                            <p>
                                Как видим, в разных языках синтаксис может
                                варьироваться, но логика остаётся единой.
                            </p>
                            <p>
                                Чтобы записать массив, нужно по конкретному
                                индексу обратиться к ячейке и присвоить
                                ей значение. Таким образом, наполнение массива
                                данными заключается в том, что программист
                                перебирает все ячейки и в каждую записывает
                                нужное значение. Также можно скопировать данные
                                из одного массива в другой — это тоже будет
                                операцией наполнения данными, только
                                произведённой не вручную, а с помощью особой
                                функции.
                            </p>
                            <p>
                                Приведём простые примеры наполнения массивов
                                данными в разных языках.
                            </p>
                            <img src="/img/theory-mock/image 2.png" alt="img" />
                        </section>
                    </article>
                    <section
                        aria-label="heading_3"
                        className="py-10 border-t border-b mt-10"
                    >
                        <h2 id="heading_3"></h2>
                        <div className="mb-6">
                            <h3 className="font-medium text-xl mb-3">
                                Тестовые задания
                            </h3>
                            <div className="flex flex-col gap-2">
                                <TaskCard
                                    difficulty="EASY"
                                    title="Поиск наибольшего элемента"
                                    isSolved
                                />
                                <TaskCard
                                    difficulty="MEDIUM"
                                    title="Поиск повторяющихся элементов"
                                />
                                <TaskCard
                                    difficulty="HARD"
                                    title="Палиндромы"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-xl mb-3">
                                Практические задания
                            </h3>
                            <div className="flex flex-col gap-2">
                                <TaskCard
                                    difficulty="EASY"
                                    title="Поиск наибольшего элемента"
                                    isSolved
                                />
                                <TaskCard
                                    difficulty="MEDIUM"
                                    title="Поиск повторяющихся элементов"
                                />
                                <TaskCard
                                    difficulty="HARD"
                                    title="Палиндромы"
                                />
                            </div>
                        </div>
                    </section>
                    <div className="flex items-center justify-between mt-7">
                        <Link
                            className="group flex items-center gap-3 transition-colors rounded-lg py-2 pr-4 pl-2 hover:bg-secondary"
                            href={"#"}
                        >
                            <ChevronLeft className="size-6!" />
                            <div className="flex flex-col">
                                <p className="text-xs text-typography-secondary w-fit">
                                    НАЗАД
                                </p>
                                <p className="group-hover:underline underline-offset-2 text-medium">
                                    О-Большое
                                </p>
                            </div>
                        </Link>
                        <Link
                            className="group flex items-center gap-3 transition-colors rounded-lg py-2 pr-2 pl-4 hover:bg-secondary"
                            href={"#"}
                        >
                            <div className="flex flex-col">
                                <p className="text-xs text-typography-secondary w-fit ml-auto">
                                    ДАЛЕЕ
                                </p>
                                <p className="group-hover:underline underline-offset-2 text-medium">
                                    Сортировки
                                </p>
                            </div>
                            <ChevronRight className="size-6!" />
                        </Link>
                    </div>
                </div>
                <TableOfContents headings={links} />
            </div>
        </div>
    );
}
