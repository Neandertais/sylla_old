import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import User from 'App/Models/User'

test.group('Course sections list', () => {
  test('list section of course', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })

    await client.post(`courses/${course.id}/sections`).json({ name: 'Introduction' }).loginAs(user!)
    await client
      .post(`courses/${course.id}/sections`)
      .json({ name: 'Introduction 2' })
      .loginAs(user!)

    const response = await client.get(`courses/${course.id}/sections`)

    response.assertBodyContains([
      {
        name: 'Introduction',
        position: 1,
      },
      {
        name: 'Introduction 2',
        position: 2,
      },
    ])
  })

  test('not list section to course not exists', async ({ client }) => {
    const response = await client.get('courses/010101/sections')

    response.assertStatus(404)
  })
})
