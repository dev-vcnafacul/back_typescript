import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { EnemArea, Frentes, Subjects } from 'App/Enums/Enem'
import { Correct } from 'App/Enums/Question'
import Exam from 'App/Models/Exam'
import Question from 'App/Models/Question'

import fs from 'fs'

import readXlsxFile from 'read-excel-file/node'
import ExcelQuestion from 'App/Class/ExcelQuestions'

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
      return 'Please upload file'
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
    question.name = name
    question.exam_id = questionDetails.examId
    question.enemArea = questionDetails.enemArea
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

    const path = __dirname.replace('app/Controllers/Http', `uploads/images/${question.name}`)

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

  public async XlsxUploadQuestion({ request, response }: HttpContextContract) {
    const excel = request.file('docx', {
      size: '1mb',
      extnames: ['xlsx', 'csv'],
    })

    if (!excel) {
      return 'Please upload file'
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

    readXlsxFile(path).then((rows: unknown[]) => {
      const excelClass = new ExcelQuestion(rows)
      const data = excelClass.verify()

      console.log(data)
    })


    try {
      fs.unlinkSync(path)
    } catch (err) {
      console.log(err)
    }
  }
}
