import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Enem } from '../../../Projetos/BancoQuestoes/Const/ConstantesImportantesEnem'

export default class EnemsController {
  public AllEnem({ response }: HttpContextContract) {
    const value = Enem

    return response.json(value)
  }
}
