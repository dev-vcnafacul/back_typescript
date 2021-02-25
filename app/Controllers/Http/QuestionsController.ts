import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import readXlsxFile from 'read-excel-file/node'

import Exam from 'App/Models/Exam'
import Question from 'App/Models/Question'
import ExcelQuestion from 'App/Class/Question/ExcelQuestions'
import { Correct, EnemArea, Frentes, Subjects } from 'App/Enums/Question'

import fs from 'fs'

export default class QuestionsController {

  public async NewQuestion({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.is_teacher) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const validationSchema = schema.create({
      enemArea: schema.enum(Object.values(EnemArea)),
      subjects: schema.enum(Object.values(Subjects)),
      frente1: schema.enum(Object.values(Frentes)),
      frente2: schema.enum(Object.values(Frentes)),
      frente3: schema.enum(Object.values(Frentes)),
      year: schema.number(),
      examId: schema.number(),
      correct: schema.enum(Object.values(Correct)),
    })

    const questionDetails = await request.validate({
      schema: validationSchema,
    })

    const myExam = await Exam.findBy('id', questionDetails.examId)

    if (myExam === null) {
      return response.status(400).json({ msg: 'O Exame selecionado não encontrado em nossa base' })
    }

    const myImage = request.file('question', {
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

    const question = new Question()

    question.user_id = auth.user.id
    question.ImagemLink = name
    question.exam_id = questionDetails.examId
    question.enem_area = questionDetails.enemArea
    question.subjects = questionDetails.subjects
    question.frente1 = questionDetails.frente1
    question.frente2 = questionDetails.frente2
    question.frente3 = questionDetails.frente3
    question.year = questionDetails.year
    question.correct = questionDetails.correct

    await question.save()

    return question
  }

  public async DeleteQuestion({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.is_teacher) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const IdQuestion = params.id

    const question = await Question.findByOrFail('id', IdQuestion)

    const path = __dirname.replace('app/Controllers/Http', `uploads/images/${question.ImagemLink}`)

    try {
      fs.unlinkSync(path)
      await question.delete()
    } catch (err) {
      return response.json({ error: err })
    }
  }

  public async SelectQuestion({ params, response }: HttpContextContract) {
    const idQuestion = params.id

    const question = await Question.findByOrFail('id', idQuestion)

    return response.json(question)
  }

  public async XlsxUploadQuestion({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.is_teacher) {
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

    const path = __dirname.replace('app/Controllers/Http', `uploads/excel/${name}`)

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
            const quest = await Question.findBy('imagem_link', data.resp[i].ImagemLink)
            if (examId === null) {
              meuRetorno.push(`${data.resp[i].exam} não existe no sistema`)
            } else if (quest !== null) {
              meuRetorno.push(`{ image: ${data.resp[i].ImagemLink}, error: Imagem já cadastrada}`)
            } else {
              await Question.create({
                ImagemLink: data.resp[i].ImagemLink,
                enem_area: data.resp[i].enemArea,
                subjects: data.resp[i].materia,
                frente1: data.resp[i].frente1,
                frente2: data.resp[i].frente2,
                frente3: data.resp[i].frente3,
                exam_id: examId.id,
                year: data.resp[i].year,
                correct: data.resp[i].correct,
              })
            }
          }
        )
      }
    }
    fs.unlinkSync(path)
    await Promise.all(arrayPromisse.map((elem) => elem()))
    return meuRetorno
  }

  public async ListAllQuestion({ response }: HttpContextContract) {
    console.log('list')
    const data = await Question.all()

    return response.json(data)
  }
}
