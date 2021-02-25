import Question from 'App/Models/Question'
import { AnswerSend, AnswerReceived } from 'App/Types/Answer'

export default class AnswerSimulate {
  private ObjAnswerStudent: AnswerReceived[]
  private ObjAnswerSend: AnswerSend[]

  constructor(ObjAnswer: AnswerReceived[]) {
    this.ObjAnswerStudent = ObjAnswer
  }

  public async myAnswer(): Promise<AnswerSend[]> {
    this.ObjAnswerStudent.map(async (element) => {
      const question = await Question.query().where('id', element.idQuestion)

      const send: AnswerSend = {
        question: question[0],
        studentAnswer: element.studentAnswer,
        correct: question[0].correct,
      }
      this.ObjAnswerSend.push(send)
    })

    return this.ObjAnswerSend
  }
}
