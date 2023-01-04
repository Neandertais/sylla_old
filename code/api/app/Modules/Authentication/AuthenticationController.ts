import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthenticationController {
  public async signUp({ auth, request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      username: schema.string([rules.trim(), rules.minLength(6), rules.maxLength(56)]),
      email: schema.string([rules.email()]),
      password: schema.string([rules.minLength(8), rules.confirmed()]),
    })

    const { username, email, password } = await request.validate({ schema: newUserSchema })

    if (await User.find(username.toLowerCase())) {
      return response.status(409).send({ message: 'Username already used' })
    }

    if (await User.findBy('email', email)) {
      return response.status(409).send({ message: 'Email already used' })
    }

    const user = await User.create({ username, email, password })

    const token = await auth.use('api').generate(user)

    return response.status(201).send({ user, token })
  }

  public async signIn({ auth, request, response }: HttpContextContract) {
    const loginSchema = schema.create({
      username: schema.string.optional([rules.trim(), rules.minLength(6), rules.maxLength(56)]),
      email: schema.string.optional([rules.email()]),
      password: schema.string([rules.minLength(8)]),
    })

    const { username, email, password } = await request.validate({ schema: loginSchema })

    if (!username && !email) {
      return response.status(422).send({
        errors: [
          {
            rule: 'required',
            fields: ['username', 'email'],
          },
        ],
      })
    }

    const identifyUser = username || email || ''

    const token = await auth.attempt(identifyUser, password)

    return { token }
  }

  public async logOut({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }

  public async check({ auth }: HttpContextContract) {
    await auth.authenticate()

    return {
      logged: auth.isAuthenticated,
    }
  }
}
