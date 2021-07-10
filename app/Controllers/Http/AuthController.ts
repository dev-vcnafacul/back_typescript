import User from 'App/Models/User'
import Token from 'App/Models/Token'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUser from '../../../Features/Auth/createUser'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
      nome: schema.string({ trim: true }),
      sobrenome: schema.string({}),
      telefone: schema.string({ trim: true }),
      genero: schema.string({}),
      nascimento: schema.date({}),
      estado: schema.string({}),
      cidade: schema.string({}),
      professor: schema.boolean(),
    })

    const { sobre } = request.only(['sobre'])

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    /**
     * Create a new user
     */

    const createUser = new CreateUser()
    const log : {erro: boolean, errorlog: string, user: User} = await createUser.createUser(userDetails, sobre)

    if(log.erro){
      console.log(log.errorlog)
      return response.status(422).json(log.errorlog)
    }

    const token = await auth.use('api').attempt(userDetails.email, userDetails.password)

    return response.status(200).json({ user: log.user.toJSON(), token: token.toJSON()})
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.findByOrFail('email', email)
    const oldtoken = await Token.findBy('user_id', user.toJSON().id)
    if(oldtoken){
      await oldtoken.delete()
    }
    const token = await auth.use('api').attempt(email, password)
    return response.json({ user: user.toJSON(), token: token.toJSON()})
  }

  public async logout({ auth }: HttpContextContract){
    await auth.logout()
  }

  public async me({ auth, response }: HttpContextContract) {
    return response.status(200).json({
      email: auth.user?.email,
      nome: auth.user?.nome,
      sobrenome: auth.user?.sobrenome,
      genero: auth.user?.genero,
      telefone: auth.user?.telefone,
      nascimento: auth.user?.nascimento,
      estado: auth.user?.estado,
      cidade: auth.user?.cidade,
      professor: auth.user?.professor,
    })
  }

  public async patchme({ auth, response, request }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', auth.user?.id)

      const data = request.all()

      console.log(data)

      user.nome = data.nome ? data.nome : user.nome 
      user.sobrenome = data.sobrenome ? data.sobrenome : user.sobrenome
      user.telefone = data.telefone? data.telefone : user.telefone
      user.genero = data.genero ? data.genero : user.genero
      user.nascimento = data.nascimento ? data.nascimento : user.nascimento
      user.estado = data.estado? data.estado : user.estado
      user.cidade = data.cidade ? data.cidade : user.cidade
      user.sobre = data.sobre ? data.sobre :  user.sobre

      await user.save()

      console.log(user.toJSON())

      return response.status(200).json(user)

    } catch (error) {
      return response.status(404).json({ error: error })
    }
  }

  public async patchAdmin({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const user = await User.findByOrFail('id', request.input('id'))

    user.admin = user.admin ? false : true
    await user.save()
  }
}
