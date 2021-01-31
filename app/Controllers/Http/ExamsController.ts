import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { Location } from 'App/Enums/Location'
import Exam from 'App/Models/Exam'

export default class ExamsController {
  public async NewExam({ auth, request, response }: HttpContextContract) {

    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const exam = new Exam()

    const validationSchema = schema.create({
      exam: schema.string({ trim: true }, [rules.unique({ table: 'exams', column: 'exam' })]),
      location: schema.enum(Object.values(Location)),
    })

    const newExam = await request.validate({
      schema: validationSchema,
    })

    exam.exam = newExam.exam
    exam.location = newExam.location
    await exam.save()

    return exam
  }

  public async DelExam({ auth, params, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const idExam = params.id

    const exam = await Exam.findByOrFail('id', idExam)

    await exam.delete()
  }

  public async ListExam({ response }: HttpContextContract) {
    const allExam = await Exam.all()

    return response.status(200).json(allExam)
  }
}
