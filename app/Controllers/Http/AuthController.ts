import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
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
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    user.nome = userDetails.nome
    user.sobrenome = userDetails.sobrenome
    user.telefone = userDetails.telefone
    user.genero = userDetails.genero
    user.nascimento = userDetails.nascimento.toJSDate()
    user.estado = userDetails.estado
    user.cidade = userDetails.cidade
    user.professor = userDetails.professor
    user.sobre = sobre
    await user.save()

    return response.status(200).json(user)
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)

    const user = await User.findByOrFail('email', email)

    return response.json({ user: user.toJSON(), token: token.toJSON()})
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

      user.nome = data.nome || user.nome
      user.sobrenome = data.sobrenome || user.sobrenome
      user.telefone = data.telefone || user.telefone
      user.genero = data.genero || user.genero
      user.nascimento = data.nascimento || user.nascimento
      user.estado = data.estado || user.estado
      user.cidade = data.cidade || user.cidade
      user.sobre = data.sobre || user.sobre

      await user.save()

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
