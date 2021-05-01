import { Indices } from '../Types/PlanQuestion'
import { EnemArea, Materias, frentes } from './Const/Questions'

const indices = [
  'ImagemLink',
  'Vestibular',
  'Year',
  'EnemArea',
  'Matéria',
  'Frente1',
  'Frente2',
  'Frente3',
  'Correct',
]

const typeCorrect = ['A', 'B', 'C', 'D', 'E']

export default class ExcelQuestion {
  private arrayExcel: any[]
  private ArrayReturn: Indices[] = []
  public log: string[] = []
  private error: boolean
  private errorNext: boolean
  private value: Indices

  constructor(excel: unknown[]) {
    this.arrayExcel = excel
    this.error = false
    this.errorNext = false
  }

  private LogGeneration(ind1: number, ind2: number, arrayTest: any[], text: string) : boolean {
    this.errorNext = true
    if(!arrayTest.includes(this.arrayExcel[ind1][ind2])){
      this.log.push(`${this.arrayExcel[ind1][ind2]} não é uma ${text} Válida`)
      this.errorNext = false
    }
    return this.errorNext
  }

  public verify() {
    if (this.verifyFirstLine(this.arrayExcel[0])) {
      return { log: this.log, resp: this.ArrayReturn, error: this.error }
    }
    for (let i = 1; i < this.arrayExcel.length; i++) {
      this.LogGeneration(i, 3, EnemArea, 'Área do Enem')
      this.LogGeneration(i, 4, Materias, 'Matéria')
      this.LogGeneration(i, 5, frentes, 'Frente')
      this.LogGeneration(i, 6, frentes, 'Frente')
      this.LogGeneration(i, 7, frentes, 'Frente')
      this.LogGeneration(i, 8, typeCorrect, 'Alternativa')
      if(!this.error) {
        this.value = {
          ImagemLink: this.arrayExcel[i][0],
          exam: this.arrayExcel[i][1],
          year: this.arrayExcel[i][2],
          enemArea: this.arrayExcel[i][3],
          materia: this.arrayExcel[i][4],
          frente1: this.arrayExcel[i][5],
          frente2: this.arrayExcel[i][6],
          frente3: this.arrayExcel[i][7],
          correct: this.arrayExcel[i][8],
        }

        try {
          this.ArrayReturn.push(this.value)
        } catch (err) {
          this.log.push(err)
        }
      }
    }
    
    return { log: this.log, resp: this.ArrayReturn, error: this.error }
  }

  private verifyFirstLine(first: any[]) : boolean {
    for (let j = 0; j < first.length; j++) {
      if (first[j] !== indices[j]) {
        const logError = `O campo ${first[j]} não é reconhecido, esperado campo ${indices[j]}`
        this.log.push(logError)
        return true
      }
    }
    return false
  }
}
