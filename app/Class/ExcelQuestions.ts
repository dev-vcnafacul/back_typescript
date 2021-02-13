import { Indices } from 'App/Types/PlanQuestion'

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

const typesEnemArea = ['Ciências Humanas', 'Ciências da Natureza', 'Linguagens', 'Matemática']

const typesSubjects = [
  'História',
  'Geografia',
  'Filosofia',
  'Sociologia',
  'Química',
  'Física',
  'Biologia',
  'Língua Portuguesa',
  'Literatura',
  'Língua Estrangeiras',
  'Artes',
  'Educação Física',
  'Tecnologia da Informação e Comunicação',
  'Matemática',
  'Atualidade',
]

const typesFrentes = [
  'Botânica e Ecologia',
  'Fisiologia animal e origem da vida',
  'Metabolismo celular, Bioquímica e Genética',
  'Eletromagnetismo',
  'Mecânica',
  'Óptica e Térmica',
  'Aritmética e Algebra',
  'Financeira e Trigonometria',
  'Geometria',
  'Físico-Química',
  'Química Geral',
  'Química Orgânica',
  'Atualidade',
  'Filosofia',
  'Sociologia',
  'Geografia do Brasil',
  'Geografia Geral',
  'História do Brasil',
  'História Geral',
  'Artes',
  'Espanhol',
  'Gramática',
  'Inglês',
  'Literatura',
  'Leitura e Produção de Texto',
  'Tecnologias da Informação e Comunicação',
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

  private LogGeneration(ind1: number, ind2: number, arrayTest: any[], text: string, error?: boolean){
    this.errorNext = true
    arrayTest.map((element) => {
        if (this.arrayExcel[ind1][ind2] === element) {
          this.errorNext = false
        }
      })
      this.errorNext = error ? false : this.errorNext
      if (this.errorNext) {
        this.error = true
        this.log.push(`${this.arrayExcel[ind1][ind2]} não é uma ${text} Válida`)
      }
  }

  public verify() {
    this.verifyFirstLine(this.arrayExcel[0])
    if (this.error) {
      console.log(this.log)
      // return { log: this.log, resp: this.ArrayReturn, error: this.error }
    }
    for (let i = 1; i < this.arrayExcel.length; i++) {
      this.LogGeneration(i, 3, typesEnemArea, 'área do Enem')
      this.LogGeneration(i, 4, typesSubjects, 'Matéria')
      this.LogGeneration(i, 5, typesFrentes, 'Frente')
      this.LogGeneration(i, 6, typesFrentes, 'Frente', true)
      this.LogGeneration(i, 7, typesFrentes, 'Frente', true)
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

  private verifyFirstLine(first: any[]) {
    for (let j = 0; j < first.length; j++) {
      if (first[j] !== indices[j]) {
        const logError = `O campo ${first[j]} não é reconhecido, esperado campo ${indices[j]}`
        this.log.push(logError)
        this.error = true
        break
      }
    }
  }
}
