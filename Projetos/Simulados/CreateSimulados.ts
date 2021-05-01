import Question from '../../app/Models/Question'
import Simulado from '../../app/Models/Simulado'
import TypesSimulado from '../../app/Models/TypesSimulado'
import { ArrayQuestion, ArraySubjects } from 'Projetos/Types/Sumulados'
import { Materias } from '../BancoQuestoes/Const/Questions'

export default class CreateSimulados {
  private name: string
  private type: TypesSimulado
  private question: Number[]
  private allQuestions: ArrayQuestion
  private ArraySubjects: ArraySubjects

  constructor(name: string, type: TypesSimulado, question: Number[]) {
    this.name = name
    this.type = type
    this.question = question

    this.createSimulate()
  }

  private async consultaQuestion() {
    this.question.map(async (element) => {
      const question: Question = await Question.findByOrFail('id', element)
      this.ArraySubjects[question.subjects].push(question)
      this.allQuestions[question.enem_area][question.subjects].push(question)
    })
  }

  private completeMyQuestion(): void {
    if (this.type.question > this.question.length) {
      this.verifyRules()
    }
  }

  private verifyRules(): void {
    if (this.type.question > this.question.length) {
      this.type.rules.map((element) => {
        if (element.quantify > this.ArraySubjects[element.subjects].length) {
          this.completeArrayQuestion(
            element.quantify - this.ArraySubjects[element.subjects].length,
            element.subjects
          )
        }
      })
    }
  }

  private async completeArrayQuestion(quantify: number, subjects: string): Promise<void> {
    const myquestion: Question[] = await Question.query()
      .where('subjects', subjects)
      .limit(quantify)
      .min('quantity_test')

    myquestion.map((element) => {
      this.ArraySubjects[element.subjects].push(element)
      this.allQuestions[element.enem_area][element.subjects].push(element)
    })
  }

  private async updateQuestion(idSimulate: number) {
    Materias.map((element) => {
      this.ArraySubjects[element].map(async (value)=>{
        value.quantity_test += 1
        value.history_test.push(idSimulate)
        await value.save()
      })
    })
  }

  private async createSimulate(): Promise<Simulado> {
    this.consultaQuestion()
    this.completeMyQuestion()

    const simulate = new Simulado()

    simulate.name = this.name
    simulate.type = this.type.id
    simulate.questions = this.allQuestions

    await simulate.save()

    this.updateQuestion(simulate.id)
    
    return simulate
  }
}
