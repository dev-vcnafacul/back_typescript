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
      password: schema.string({ trim: true }, [rules.confirmed(), rules.required()]),
      first_name: schema.string({ trim: true }, [rules.required()]),
      last_name: schema.string({}, [rules.required()]),
      phone: schema.string({ trim: true }, [rules.required()]),
      gender: schema.string({}, [rules.required()]),
      birthday: schema.date({ format: 'DD/MM/YYYY' }, [rules.required()]),
      state: schema.string({}, [rules.required()]),
      city: schema.string({}, [rules.required()]),
      is_teacher: schema.boolean([rules.required()]),
    })

    const { about } = request.only(['about'])

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    /**
     * Create a new user
     */
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    user.first_name = userDetails.first_name
    user.last_name = userDetails.last_name
    user.phone = userDetails.phone
    user.gender = userDetails.gender
    user.birthday = userDetails.birthday.toJSDate()
    user.state = userDetails.state
    user.city = userDetails.city
    user.is_teacher = userDetails.is_teacher
    user.about = about
    await user.save()

    return response.status(200).json(user)
  }

  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }

  public async me({ auth, response }: HttpContextContract) {
    return response.status(200).json({
      email: auth.user?.email,
      first_name: auth.user?.first_name,
      last_name: auth.user?.last_name,
      gender: auth.user?.gender,
      phone: auth.user?.phone,
      birthday: auth.user?.birthday,
      state: auth.user?.state,
      city: auth.user?.city,
      is_teacher: auth.user?.is_teacher,
    })
  }

  public async patchme({ auth, response, request }: HttpContextContract) {
    const user = await User.findByOrFail('id', auth.user?.id)

    const data = request.all()

    user.first_name = data.first_name || user.first_name
    user.last_name = data.last_name || user.last_name
    user.phone = data.phone || user.phone
    user.gender = data.gender || user.gender
    user.birthday = data.birthday || user.birthday
    user.state = data.state || user.state
    user.city = data.city || user.city
    user.about = data.about || user.about

    await user.save()

    return response.status(200).json(user)
  }

  public async patchAdmin({ auth, request, response }: HttpContextContract){
    const user = await User.findByOrFail('id', request.input('id'))

    user.admin = user.admin ? false : true
    await user.save()
  }
}
