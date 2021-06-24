import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import readXlsxFile from 'read-excel-file/node'

import Exam from 'App/Models/Exam'
import Questao from 'App/Models/Questoes'
import ExcelQuestion from '../../../Features/BancoQuestoes/ExcelQuestions'
import {EnemArea, Materias, Frentes, Alternativa } from '../../../Features/BancoQuestoes/ConstantesEnem'

import fs from 'fs'


export default class QuestionsController {

  public async NovaQuestao({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const validationSchema = schema.create({
      enem_area: schema.enum(Object.values(EnemArea)),
      materia: schema.enum(Object.values(Materias)),
      frente_1: schema.enum(Object.values(Frentes)),
      frente_2: schema.enum(Object.values(Frentes)),
      frente_3: schema.enum(Object.values(Frentes)),
      ano: schema.number(),
      exam_id: schema.number(),
      alternativa: schema.enum(Object.values(Alternativa)),
    })

    const questionDetails = await request.validate({
      schema: validationSchema,
    })

    const myExam = await Exam.findBy('id', questionDetails.exam_id)

    if (myExam === null) {
      return response.status(400).json({ msg: 'O Exame selecionado não encontrado em nossa base' })
    }

    const myImage = request.file('image', {
      size: '0.2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!myImage) {
      return response.status(400).json({ error: 'File not found' })
    }

    if (myImage.hasErrors) {
      return myImage.errors
    }

    const name = `${new Date().getTime()}.${myImage.extname}`

    if (
      !myImage.move('uploads/images', {
        name: name,
        overwrite: false,
      })
    ) {
      response.status(404)
      return myImage.errors
    }

    const questao = new Questao()

    questao.user_id = auth.user.id
    questao.Imagem_link = name
    questao.exam_id = questionDetails.exam_id
    questao.enem_area = questionDetails.enem_area
    questao.materia = questionDetails.materia
    questao.frente_1 = questionDetails.frente_1
    questao.frente_2 = questionDetails.frente_2
    questao.frente_3 = questionDetails.frente_3
    questao.ano = questionDetails.ano
    questao.alternativa = questionDetails.alternativa

    await questao.save()

    return questao
  }

  public async DeletarQuestao({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const IdQuestao = params.id

    const questao = await Questao.findByOrFail('id', IdQuestao)

    const path = this.replacePath(questao.Imagem_link, 'images')

    try {
      fs.unlinkSync(path)
      await questao.delete()
    } catch (err) {
      return response.json({ error: err })
    }
  }

  public async SelecionarQuestao({ params, response }: HttpContextContract) {

    const IdQuestao = params.id

    const questao = await Questao.findByOrFail('id', IdQuestao)

    return response.json(questao)
  }

  // Função precisa ser revisada ... 
  public async XlsxUploadQuestion({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }
    

    const excel = request.file('planilha', {
      size: '2mb',
      extnames: ['xlsx', 'csv'],
    })

    if (!excel) {
      return response.status(400).json({ error: 'File not found' })
    }
    
    if (excel.hasErrors) {
      return response.json({ error: excel.errors }) 
    }
    const nome = `${new Date().getTime()}.${excel.extname}`

    try {
      await excel.move('uploads/excel/', {
        name: nome,
        overwrite: true,
      })
    } catch (err) {
      response.status(404).json({ error: err })
      return err
    }

    const path = this.replacePath(nome, 'excel')

    const myFile = await readXlsxFile(path)
    
    const excelClass = new ExcelQuestion(myFile, auth.user?.id)
    const data = excelClass.verify()

    if(data.resp.length > 0) {
      const errorCadastroFinal = await excelClass.CadastroQuestao1a1()
      data.log.concat(errorCadastroFinal)
    }
    
    return response.status(200).json({ error: data.log })
  }
  
  public async ListarQuestoes({ response }: HttpContextContract) {
    return response.json(await Questao.all())
  }

  // Essa Função não deveria estar aqui. Não é Responsabilidade do Controller fazer isso.
  private replacePath(nome: string, pasta: string) : string {
    if (process.platform.includes('win')) {
      return __dirname.replace('app\\Controllers\\Http', `uploads\\${pasta}\\${nome}`)
    }
    return __dirname.replace('app/Controllers/Http', `uploads/${pasta}/${nome}`)
  }
}
