import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import RespostasSimulado from 'Projetos/Simulados/RespostasSimulado'
import CriarSimulado from 'Projetos/Simulados/CriarSimulados'
import { Materias } from 'Projetos/BancoQuestoes/Enums/Questoes'
import Simulado from 'App/Models/Simulado'
import TipoSimulado from 'App/Models/TipoSimulado'
import { Resposta, RespostaCorreta } from 'Projetos/Simulados/Tipos/Resposta'

export default class SimuladosController {

  public async CriarTipo({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const validationSchema = schema.create({
      name: schema.string({}, [rules.unique({ table: 'types_simulados', column: 'name' })]),
      question: schema.number(),
      rules: schema.array().members(
        schema.object().members({
          materia: schema.enum(Object.values(Materias)),
          quantidade: schema.number(),
        })
      ),
    })

    const typeDetails = await request.validate({
      schema: validationSchema,
    })

    const tipo = new TipoSimulado()

    tipo.nome = typeDetails.name
    tipo.quantidadeTotalQuestoes = typeDetails.question
    tipo.regra = typeDetails.rules

    tipo.save()

    return response.status(200).json(tipo)
  }

  public async DeletarTipo({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.professor && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }
    const idType = params.id

    const type = await TipoSimulado.findByOrFail('id', idType)

    type.delete()
  }

  public async ListarTipos({ response }: HttpContextContract) {
    const allTypes = await TipoSimulado.all()

    return response.json(allTypes)
  }

  public async CriarSimulado({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const validationSchema = schema.create({
      nome: schema.string({}, [rules.unique({ table: 'simulados', column: 'nome' })]),
      idTipo: schema.number(),
      questoes: schema.array().members(schema.number()),
    })

    const data = await request.validate({
      schema: validationSchema,
    })

    const tipo = await TipoSimulado.findByOrFail('id', data.idTipo)

    const Simulado = new CriarSimulado(data.nome, tipo, data.questoes)

    const idSimulado = Simulado.CriarSimulados()

    return response.status(200).send(idSimulado)
  }

  public async ChamarSimulado({ params }: HttpContextContract) {
    const meuSimulado = await Simulado.findOrFail('id', params.id)

    return meuSimulado
  }

  public async RespostaSimulado({ request }: HttpContextContract): Promise<RespostaCorreta[]> {
    const validationSchema = schema.create({
      ObjAnswer: schema.array().members(
        schema.object().members({
          idQuestao: schema.number(),
          RespostaEstudante: schema.string(),
        })
      ),
    })

    await request.validate({
      schema: validationSchema,
    })

    const ObjRespostasRecebidas: Resposta[] = request.input('ObjResposta')

    const ObjResposta = new RespostasSimulado(ObjRespostasRecebidas)

    const Resposta = await ObjResposta.VerificandoResposta()

    return Resposta
  }
}
