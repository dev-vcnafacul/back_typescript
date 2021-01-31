import Question from "App/Models/Question";

export type AnswerSend = {
    question: Question
    studentAnswer: string
    correct: string
}

export type AnswerReceived = {
    idQuestion: number
    studentAnswer: string
}