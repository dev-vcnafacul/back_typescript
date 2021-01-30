import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import CreateSimulados from 'App/Class/CreateSimulados'
import Simulado from 'App/Models/Simulado'
import TypesSimulado from 'App/Models/TypesSimulado'

export default class SimuladosController {
  public async createTypes({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({}, [
        rules.unique({ table: 'types_simulados', column: 'name' }),
        rules.required(),
      ]),
      question: schema.number([rules.required()]),
      rules: schema.string({}, [rules.required()]),
    })

    const typeDetails = await request.validate({
      schema: validationSchema,
    })

    const type = new TypesSimulado()

    type.name = typeDetails.name
    type.question = typeDetails.question
    type.rules = JSON.parse(typeDetails.rules)

    type.save()

    return response.status(200).json(type)
  }

  public async delTypes({ request }: HttpContextContract) {
    const idType = request.input('id')

    const type = await TypesSimulado.findByOrFail('id', idType)

    type.delete()
  }

  public async listTypes({ response }: HttpContextContract) {
    const allTypes = await TypesSimulado.all()

    return response.json(allTypes)
  }

  public async createSimulado({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({}, [
        rules.required(),
        rules.unique({ table: 'simulados', column: 'name' }),
      ]),
      idtype: schema.number([rules.required()]),
      questions: schema.array().members(schema.number()),
    })

    const data = await request.validate({
      schema: validationSchema,
    })

    const type = await TypesSimulado.findByOrFail('id', data.idtype)

    const myNewSimulate = new CreateSimulados(data.name, type, data.questions)

    return response.status(200).send(myNewSimulate)
  }

  public async callSimulate({ request }: HttpContextContract) {
    const mySimulate = await Simulado.findOrFail('id', request.input('id'))

    return mySimulate
  }

  
}
