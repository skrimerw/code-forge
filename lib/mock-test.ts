export type TestBody = Question[];

export type Question = {
  id: number;
  title: string;
  type: QuestionType;
  actualAnswer: number | number[];
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
    title: "What is an array?",
    type: "singular",
    actualAnswer: 1,
    answers: [
      {
        id: 1,
        label: "It's a data structure",
      },
      {
        id: 2,
        label: "WHAT???",
      },
    ],
  },
  {
    id: 2,
    title: "Which statements are true?",
    type: "multiple",
    actualAnswer: [1, 2],
    answers: [
      {
        id: 1,
        label: "Array is a sequential data structure",
      },
      {
        id: 2,
        label: "Array elements are addressed by indices",
      },
      {
        id: 3,
        label: "Array is type of variable",
      },
    ],
  },
];

export const userAnswersMock: UserAnswers = {
  "1": 1,
  "2": [1, 2],
};
