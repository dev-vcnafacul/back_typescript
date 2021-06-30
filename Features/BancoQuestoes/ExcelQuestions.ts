import { Indices } from './Tipos/PlanQuestion'
import { EnemArea, Materias, Frentes } from './ConstantesEnem'

import { DownloadGoogleDriveAPI } from '../GoogleDriveAPI/Downloader/index'

import Exam from 'App/Models/Exam'
import Questao from 'App/Models/Questoes'

import fs from 'fs'

const indices = [
  'ImagemLink',
  'Vestibular',
  'Ano',
  'exam',
  'EnemArea',
  'Materia',
  'Frente1',
  'Frente2',
  'Frente3',
  'Alternativa',
]

const typeCorrect = ['A', 'B', 'C', 'D', 'E']

export default class ExcelQuestion {
  private arrayExcel: any[]
  private ArrayReturn: Indices[] = []
  public log: string[] = []
  private errorFirst: boolean
  private errorQuestao: boolean
  private value: Indices
  private userid: number

  constructor(excel: unknown[], userid: number) {
    this.arrayExcel = excel
    this.userid = userid
  }

  public verify() {
    if (this.verifyFirstLine(this.arrayExcel[0])) {
      return { log: this.log, resp: this.ArrayReturn}
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
    return { log: this.log, resp: this.ArrayReturn }
  }

  public async CadastroQuestao1a1(): Promise<string[]> {

    const meuRetorno: string[] = []
    const arrayPromisse: (() => Promise<boolean>)[] = []

    for (let i = 0; i < this.ArrayReturn.length; i++) {
        arrayPromisse.push(
          async (): Promise<boolean> => {

            const examId = await Exam.findBy('exam', this.ArrayReturn[i].exam)

            if (examId === null) {
              meuRetorno.push(`{ error: ${this.ArrayReturn[i].exam} não existe no sistema}`)
              return false

            } 

            const fileid = this.ArrayReturn[i].ImagemLink.split('id=')[1]
            
            const nomearquivo = this.DownloadImages(fileid)
            
            if(nomearquivo === '') {
              meuRetorno.push(`{ error: Não foi possível localizar a imagem ${this.ArrayReturn[i].ImagemLink}}`)
              return false

            } else {

              try {
                const question = new Questao()

                question.user_id = this.userid
                question.Imagem_link = nomearquivo
                question.exam_id = examId.id
                question.enem_area = this.ArrayReturn[i].enemArea
                question.materia = this.ArrayReturn[i].materia
                question.frente_1 = this.ArrayReturn[i].frente1
                question.frente_2 = this.ArrayReturn[i].frente2
                question.frente_3 = this.ArrayReturn[i].frente3
                question.ano = this.ArrayReturn[i].ano
                question.alternativa = this.ArrayReturn[i].alternativa

                await question.save()

                return true

              } catch (error) {
                fs.unlinkSync(this.replacePath(nomearquivo, 'images'))
                meuRetorno.push(`{ error: Não foi possível cadastrar Questao ${this.ArrayReturn[i].ImagemLink}. ${error}}`)
                return false
              }
            }
          }
        )
      }
      
      await Promise.all(arrayPromisse.map((elem) => elem()))
      return meuRetorno
  }

  private replacePath(nome: string, pasta: string) : string {
    if (process.platform.includes('win')) {
      return __dirname.replace('Features\\BancoQuestoes', `uploads\\${pasta}\\${nome}`)
    }
    return __dirname.replace('Features/BancoQuestoes', `uploads/${pasta}/${nome}`)
  }

  private DownloadImages(fileid: string): string {
    const GoogleDrive = new DownloadGoogleDriveAPI()

    const nomearquivo = `${new Date().getTime()}.jpeg`

    if(fileid != '' && !GoogleDrive.Download(fileid, `uploads/images/${nomearquivo}`)){
      return nomearquivo
    }
    return ''  
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
      this.log.push(`{error: linha ${linha} --- ${this.arrayExcel[linha][coluna]} não é uma ${text} Válida}`)
      return true
    }
    return false
  }

  private verifyFirstLine(first: any[]) : boolean {
    this.errorFirst = false
    for (let j = 0; j < first.length; j++) {
      if (first[j] !== indices[j]) {
        const logError = `{error: O campo ${first[j]} não é reconhecido, esperado campo ${indices[j]}}`
        this.log.push(logError)
        this.errorFirst = true
      }
    }
    return this.errorFirst
  }

  
}
