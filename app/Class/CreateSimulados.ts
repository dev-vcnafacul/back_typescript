import Question from 'App/Models/Question'
import Simulado from 'App/Models/Simulado'
import TypesSimulado from 'App/Models/TypesSimulado'
import { ArrayFrentes, ArrayQuestion } from 'App/Types/Sumulados'

export default class CreateSimulados {
  private readonly name: string
  private readonly type: TypesSimulado
  private readonly question: Number[]
  private AQuestion: Question[]
  private allQuestions: ArrayQuestion
  private Arrayfrentes: ArrayFrentes

  constructor(name: string, type: TypesSimulado, question: Number[]) {
    this.name = name
    this.type = type
    this.question = question
  }

  private async consultSQLQuestion() {
    this.question.map(async (element) => {
      const question: Question = await Question.findByOrFail('id', element)
      this.Arrayfrentes[question.frente].push(question.id)
      this.allQuestions[question.enemArea][question.subjects].push(question)
    })
  }

  private completeMyQuestion(): void {
    this.listQuestions(this.AQuestion)
    if (this.type.question > this.question.length) {
      this.verifyRules()
    }
  }

  private verifyRules(): void {
    this.type.rules.map((element) => {
      if (element.quantify > this.Arrayfrentes[element.frente].length) {
        this.completeFrente(
          element.quantify - this.Arrayfrentes[element.frente].length,
          element.frente
        )
      }
    })
  }

  private listQuestions(question: Question[]): void {
    question.map((element) => {
      this.Arrayfrentes[element.frente].push(element.id)
      this.allQuestions[element.enemArea][element.subjects].push(element)
    })
  }

  private async completeFrente(quantify: number, frente: string): Promise<void> {
    const myquestion: Question[] = await Question.query()
      .where('frente', frente)
      .limit(quantify)
      .min('quantity_test')

    myquestion.map((element) => {
      this.Arrayfrentes[element.frente].push(element.id)
      this.allQuestions[element.enemArea][element.subjects].push(element)
    })
  }

  public async createSimulate(): Promise<Simulado> {
    this.consultSQLQuestion()
    this.completeMyQuestion()

    const simulate = new Simulado()

    simulate.name = this.name
    simulate.type = this.type.id
    simulate.questions = this.allQuestions

    await simulate.save()

    return simulate
  }
}
