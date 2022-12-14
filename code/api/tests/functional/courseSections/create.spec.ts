import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import User from 'App/Models/User'

test.group('Section courses create', () => {
  test('create course section', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Hello', ownerId: user?.username })

    const response = await client
      .post(`courses/${course.id}/sections`)
      .json({ name: 'Introduction' })
      .loginAs(user!)

    const response2 = await client
      .post(`courses/${course.id}/sections`)
      .json({ name: 'Introduction' })
      .loginAs(user!)

    response.assertStatus(201)
    response.assertBodyContains({ name: 'Introduction' })

    response2.assertStatus(201)
    response2.assertBodyContains({ name: 'Introduction' })
  })

  test('not create course section if name not send', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Hello', ownerId: user?.username })

    const response = await client.post(`courses/${course.id}/sections`).loginAs(user!)

    response.assertStatus(422)
  })

  test('not create course section if user not owner', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Hello' })

    const response = await client.post(`courses/${course.id}/sections`).loginAs(user!)

    response.assertStatus(401)
  })
})
