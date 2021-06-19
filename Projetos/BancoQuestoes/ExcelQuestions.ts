import { Indices } from './Tipos/PlanQuestion'
import { EnemArea, Materias, Frentes } from './ConstantesEnem'

const indices = [
  'ImagemLink',
  'Vestibular',
  'Year',
  'EnemArea',
  'Materia',
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
  private errorFirst: boolean
  private errorQuestao: boolean
  private value: Indices

  constructor(excel: unknown[]) {
    this.arrayExcel = excel
    this.error = false
  }

  public verify() {
    if (this.verifyFirstLine(this.arrayExcel[0])) {
      return { log: this.log, resp: this.ArrayReturn, error: this.error }
    }
    for (let i = 1; i < this.arrayExcel.length; i++) {
      if(!this.verificarCadaQuestao(i)) {
        this.value = {
          ImagemLink: this.arrayExcel[i][0],
          exam: this.arrayExcel[i][1],
          ano: this.arrayExcel[i][2],
          enemArea: this.arrayExcel[i][3],
          materia: this.arrayExcel[i][4],
          frente1: this.arrayExcel[i][5],
          frente2: this.arrayExcel[i][6],
          frente3: this.arrayExcel[i][7],
          alternativa: this.arrayExcel[i][8],
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

  private verificarCadaQuestao(linha: number) : boolean {
      this.errorQuestao = this.LogGeneration(linha, 3, EnemArea, 'Área do Enem')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 4, Materias, 'Matéria')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 5, Frentes, 'Frente')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 6, Frentes, 'Frente')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 7, Frentes, 'Frente')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 8, typeCorrect, 'Alternativa')
      return this.errorQuestao
  }

  private LogGeneration(linha: number, coluna: number, arrayTest: any[], text: string) : boolean {
    if(!arrayTest.includes(this.arrayExcel[linha][coluna])){
      this.log.push(`linha ${linha} --- ${this.arrayExcel[linha][coluna]} não é uma ${text} Válida`)
      return true
    }
    return false
  }

  private verifyFirstLine(first: any[]) : boolean {
    this.errorFirst = false
    for (let j = 0; j < first.length; j++) {
      if (first[j] !== indices[j]) {
        const logError = `O campo ${first[j]} não é reconhecido, esperado campo ${indices[j]}`
        this.log.push(logError)
        this.errorFirst = true
      }
    }
    return this.errorFirst
  }

}
