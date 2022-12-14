import { test } from '@japa/runner'
import User from 'App/Models/User'
import { file } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'

test.group('Courses create', () => {
  test('create course', async ({ client }) => {
    const user = await User.find('mateus')

    const fakeThumbnail = await file.generateJpg('1mb')

    const drive = Drive.fake()

    const response = await client
      .post('courses')
      .file('thumbnail', fakeThumbnail.contents, { filename: fakeThumbnail.name })
      .fields({
        name: 'Como programar com Javascript',
        description: 'Aprenda o melhor do Javascript comigo',
        price: 13,
      })
      .loginAs(user!)

    drive.restore('local')

    response.assertStatus(201)
    response.assertBodyContains({
      data: {
        name: 'Como programar com Javascript',
        description: 'Aprenda o melhor do Javascript comigo',
        price: 13,
      },
    })
  })
})
