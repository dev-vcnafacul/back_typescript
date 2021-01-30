import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { EnemArea, Frentes, Materias } from 'App/Enums/Enem'
import { Correct } from 'App/Enums/Question'
import Exam from 'App/Models/Exam'
import Question from 'App/Models/Question'
import { roundToNearestMinutes } from 'date-fns'

export default class QuestionsController {
  public async NewQuestion({ auth, request, response }: HttpContextContract) {
    if (!auth.user) {
      return {}
    }

    const validationSchema = schema.create({
      enemArea: schema.enum(Object.values(EnemArea)),
      subjects: schema.enum(Object.values(Materias)),
      frente: schema.enum(Object.values(Frentes)),
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
      size: '0.1mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!myImage) {
      return 'Please upload file'
    }

    if (myImage.hasErrors) {
      return myImage.errors
    }

    const name = `${new Date().getTime()}.${myImage.extname}`

    await myImage.move('uploads', {
      name: name,
      overwrite: false,
    })

    if (!myImage.move('uploads')) {
      response.status(404)
      return myImage.errors
    }

    const question = new Question()
    question.user_id = auth.user.id
    question.name = name
    question.exam_id = questionDetails.examId
    question.enemArea = questionDetails.enemArea
    question.subjects = questionDetails.subjects
    question.frente = questionDetails.frente
    question.year = questionDetails.year
    question.correct = questionDetails.correct

    await question.save()

    return response.status(200).json({ msg: 'Questão Cadastrada' })
  }

  public async DeleteQuestion({ request }: HttpContextContract) {
    const IdQuestion = request.input('id')

    const question = await Question.findByOrFail('id', IdQuestion)

    await question.delete()
  }

  public async SelectQuestion({ request, response }: HttpContextContract) {
    const idQuestion = request.input('id')

    const question = await Question.findByOrFail('id', idQuestion)

    return response.json(question)
  }
}
