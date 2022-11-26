import { test } from '@japa/runner'
import User from 'App/Models/User'
import { file } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import Course from 'App/Models/Course'

test.group('Update create', () => {
  test('update course', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({
      name: 'Best course',
      description: 'The best of course',
      ownerId: user?.username,
    })

    const fakeThumbnail = await file.generateJpg('1mb')

    const drive = Drive.fake()

    const response = await client
      .patch(`courses/${course.id}`)
      .file('thumbnail', fakeThumbnail.contents, { filename: fakeThumbnail.name })
      .fields({
        name: 'Como programar com Javascript',
        description: 'Aprenda o melhor do Javascript comigo',
        price: 13,
      })
      .loginAs(user!)

    drive.restore('local')

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Como programar com Javascript',
      description: 'Aprenda o melhor do Javascript comigo',
      price: 13,
    })
  })
})
