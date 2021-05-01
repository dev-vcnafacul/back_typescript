import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import AnswerSimulate from 'Projetos/Simulados/AnswerSimulate'
import CreateSimulados from 'Projetos/Simulados/CreateSimulados'
import { Subjects } from 'Projetos/Enums/Question'
import Simulado from 'App/Models/Simulado'
import TypesSimulado from 'App/Models/TypesSimulado'
import { AnswerReceived, AnswerSend } from 'Projetos/Types/Answer'

export default class SimuladosController {
  public async createTypes({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.is_teacher && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const validationSchema = schema.create({
      name: schema.string({}, [rules.unique({ table: 'types_simulados', column: 'name' })]),
      question: schema.number(),
      rules: schema.array().members(
        schema.object().members({
          subjects: schema.enum(Object.values(Subjects)),
          quantify: schema.number(),
        })
      ),
    })

    const typeDetails = await request.validate({
      schema: validationSchema,
    })

    const type = new TypesSimulado()

    type.name = typeDetails.name
    type.question = typeDetails.question
    type.rules = typeDetails.rules

    type.save()

    return response.status(200).json(type)
  }

  public async delTypes({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.is_teacher && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }
    const idType = params.id

    const type = await TypesSimulado.findByOrFail('id', idType)

    type.delete()
  }

  public async listTypes({ response }: HttpContextContract) {
    const allTypes = await TypesSimulado.all()

    return response.json(allTypes)
  }

  public async createSimulado({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.is_teacher && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const validationSchema = schema.create({
      name: schema.string({}, [rules.unique({ table: 'simulados', column: 'name' })]),
      idtype: schema.number(),
      questions: schema.array().members(schema.number()),
    })

    const data = await request.validate({
      schema: validationSchema,
    })

    const type = await TypesSimulado.findByOrFail('id', data.idtype)

    const ObjmyNewSimulate = new CreateSimulados(data.name, type, data.questions)

    return response.status(200).send(ObjmyNewSimulate)
  }

  public async callSimulate({ params }: HttpContextContract) {
    const mySimulate = await Simulado.findOrFail('id', params.id)

    return mySimulate
  }

  public async answersimulate({ request }: HttpContextContract): Promise<AnswerSend[]> {
    const validationSchema = schema.create({
      ObjAnswer: schema.array().members(
        schema.object().members({
          idQuestion: schema.number(),
          studentAnswer: schema.string(),
        })
      ),
    })

    await request.validate({
      schema: validationSchema,
    })

    const ObjAnswerReceived: AnswerReceived[] = request.input('ObjAnswer')

    const ObjAnswer = new AnswerSimulate(ObjAnswerReceived)

    const Answer = await ObjAnswer.myAnswer()

    return Answer
  }
}
