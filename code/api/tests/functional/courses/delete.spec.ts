import { test } from '@japa/runner'
import User from 'App/Models/User'
import Course from 'App/Models/Course'

test.group('Courses delete', () => {
  test('delete course by id', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })

    const response = await client.delete(`courses/${course.id}`).loginAs(user!)

    response.assertBody({ message: 'Course deleted successfully' })
  })

  test('not delete course if not authenticated', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })

    const response = await client.delete(`courses/${course.id}`)

    response.assertStatus(401)
  })

  test('not delete course if not owner', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course' })

    const response = await client.delete(`courses/${course.id}`).loginAs(user!)

    response.assertStatus(401)
  })
})
