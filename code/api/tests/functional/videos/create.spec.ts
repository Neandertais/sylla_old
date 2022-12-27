import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'
import User from 'App/Models/User'
import { file } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'

test.group('Videos create', () => {
  test('create video', async ({ client, assert }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Javascript Course', ownerId: user?.username })
    const section = await CourseSection.create({ name: 'Introduction', courseId: course.id })

    const fakeVideo = await file.generateGif('5mb')

    const drive = Drive.fake()

    const response = await client
      .post(`courses/${course.id}/upload`)
      .file('video', fakeVideo.contents, { filename: fakeVideo.name })
      .fields({
        name: 'Configuring computer',
        section: section.id,
      })
      .loginAs(user!)

    assert.isTrue(await drive.exists(fakeVideo.name))

    drive.restore('local')

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Configuring computer',
    })
  })
})
