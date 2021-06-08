import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import readXlsxFile from 'read-excel-file/node'

import Exam from 'App/Models/Exam'
import Questao from 'App/Models/Questoes'
import ExcelQuestion from '../../../Projetos/BancoQuestoes/ExcelQuestions'
import {EnemArea, Materias, Frentes, Alternativa } from '../../../Projetos/BancoQuestoes/Const/ConstantesEnem'

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

    console.log("Deletar Questão")

    const IdQuestao = params.id

    const questao = await Questao.findByOrFail('id', IdQuestao)

    let path = ''

    if(process.platform.includes('win')){
      path = __dirname.replace('app\\Controllers\\Http', 'uploads\\images\\' + `${questao.Imagem_link}`)
    } else {
      path = __dirname.replace('app/Controllers/Http', `uploads/images/${questao.Imagem_link}`)
    }

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
    

    const excel = request.file('docx', {
      size: '2mb',
      extnames: ['xlsx', 'csv'],
    })

    if (!excel) {
      return response.status(400).json({ error: 'File not found' })
    }
    
    if (excel.hasErrors) {
      return excel.errors
    }
    const name = `${new Date().getTime()}.${excel.extname}`

    try {
      await excel.move('uploads/excel/', {
        name: name,
        overwrite: true,
      })
    } catch (err) {
      response.status(404)
      return err
    }
    
    const path = __dirname.replace('app\\Controllers\\Http', `uploads\\excel\\${name}`)
    const myFile = await readXlsxFile(path)
    
    const excelClass = new ExcelQuestion(myFile)
    const data = excelClass.verify()

    const meuRetorno: string[] = []
    const arrayPromisse: (() => Promise<void>)[] = []
    if (!data.error) {
      for (let i = 0; i < data.resp.length; i++) {
        arrayPromisse.push(
          async (): Promise<void> => {
            const examId = await Exam.findBy('exam', data.resp[i].exam)
            const quest = await Questao.findBy('imagem_link', data.resp[i].ImagemLink)
            if (examId === null) {
              meuRetorno.push(`${data.resp[i].exam} não existe no sistema`)
            } else if (quest !== null) {
              meuRetorno.push(`{ image: ${data.resp[i].ImagemLink}, error: Imagem já cadastrada}`)
            } else {
              const question = new Questao()

              question.user_id = auth.user?.id || 1
              question.Imagem_link = data.resp[i].ImagemLink
              question.exam_id = examId.id
              question.enem_area = data.resp[i].enemArea
              question.materia = data.resp[i].materia
              question.frente_1 = data.resp[i].frente1
              question.frente_2 = data.resp[i].frente2
              question.frente_3 = data.resp[i].frente3
              question.ano = data.resp[i].ano
              question.alternativa = data.resp[i].alternativa

              await question.save()
            }
          }
        )
      }
    } else {
      return response.status(404).json(data)
    }
    fs.unlinkSync(path)
    await Promise.all(arrayPromisse.map((elem) => elem()))
    return meuRetorno
  }
  
  public async ListarQuestoes({ response }: HttpContextContract) {
    return response.json(await Questao.all())
  }
}
