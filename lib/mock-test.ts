export type TestBody = Question[];

export type Question = {
    id: number;
    title: string;
    type: QuestionType;
    actualAnswer: number | number[] ;
    explanation?: string;
    answers: Answer[];
};

export type QuestionType = "singular" | "multiple";

export type Answer = {
    id: number;
    label: string;
};

export type UserAnswers = Record<string, number | number[]>;

export const testBodyMock: TestBody = [
    {
        id: 1,
        title: "Что такое массив?",
        type: "singular",
        actualAnswer: 1,
        answers: [
            {
                id: 1,
                label: "Это структура данных, которая хранит информацию последовательно в памяти",
            },
            {
                id: 2,
                label: "ЧТО???",
            },
        ],
    },
    {
        id: 2,
        title: "Выберите правдивые утверждения?",
        type: "multiple",
        actualAnswer: [1, 2],
        answers: [
            {
                id: 1,
                label: "Массив - это последовательная структура данных",
            },
            {
                id: 2,
                label: "Обращение к элементам массива происходит с помощью индексов",
            },
            {
                id: 3,
                label: "Массив - это тип переменной",
            },
        ],
    },
];

export const userAnswersMock: UserAnswers = {
    "1": 1,
    "2": [1, 2],
};
