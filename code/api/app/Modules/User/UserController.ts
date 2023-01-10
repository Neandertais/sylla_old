import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { nanoid } from 'nanoid'
import User from 'App/Models/User'

export default class UsersController {
  public async userInfo({ params, response }: HttpContextContract) {
    const user = await User.find(params.username)

    if (!user) {
      return response.status(404).send({
        errors: [
          {
            title: 'Resource not found',
          },
        ],
      })
    }

    return user
  }

  public async userEdit({ auth, request, response, params }: HttpContextContract) {
    await auth.authenticate()

    // Logic to permit user edit
    if (params.username !== auth.user?.username) {
      return response.status(401).send({ errors: [{ title: 'Unauthorized' }] })
    }

    const editUserSchema = schema.create({
      username: schema.string.optional([rules.trim(), rules.minLength(6), rules.maxLength(56)]),
      name: schema.string.optional([rules.minLength(6), rules.maxLength(80)]),
      biography: schema.string.optional([rules.minLength(12), rules.maxLength(240)]),
    })

    const payload = await request.validate({ schema: editUserSchema })

    if (payload.username) {
      const user = await User.find(payload.username)
      if (user) return response.status(409).send({ errors: [{ title: 'Username in use' }] })
    }

    auth.user?.merge(payload)

    const avatarImage = request.file('avatar', {
      size: '5mb',
      extnames: ['jpg', 'png', 'webp'],
    })

    if (avatarImage) {
      const filename = `${nanoid()}.${avatarImage.extname}`

      await avatarImage.moveToDisk('./', {
        name: filename,
      })

      // TODO - remove image

      auth.user?.merge({ avatar: filename })
    }

    const user = await auth.user?.save()

    return user
  }
}
