import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { isBefore, subHours } from 'date-fns'

import User from 'App/Models/User'
import Token from 'App/Models/Token'

import { randomBytes } from 'crypto'
import { promisify } from 'util'

import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class ForgotsController {
  public async forgot({ request, response }: HttpContextContract) {
    const email = request.input('email')

    const user = await User.findBy('email', email)

    if (user === null) {
      return response.status(409).json({ msg: 'Email não existe' })
    }

    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')

    const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`

    await Token.create({
      userId: user.id,
      type: 'forgot',
      token: token,
      expiresAt: false,
    })

    await Mail.use('smtp').send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'))
        .to(user.email)
        .subject('Esqueci a Senha - Você na Facul')
        .htmlView('forgot.edge', {
          nome: user.nome,
          token: resetPasswordUrl,
        })
    })
  }

  public async reset({ request, response }: HttpContextContract) {
    const { password, token } = request.only(['password', 'token'])

    try {
      const userToken = await Token.findByOrFail('token', token)

      if (isBefore(new Date(userToken.createdAt.toString()), subHours(new Date(), 2))) {
        return response.status(400).json({ msg: 'validade do token expirou' })
      }

      if (userToken.expiresAt === true) {
        return response.status(400).json({ msg: 'validade do token expirou' })
      }

      userToken.expiresAt = true
      await userToken.save()


      const user = await User.query().preload('token')

      user[0].password = password

      await user[0].save()
    } catch (error) {
      console.log(error)
      return response.status(404).json({ message: error})
    }

    
  }
}
