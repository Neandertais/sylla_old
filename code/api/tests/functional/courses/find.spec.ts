import { test } from '@japa/runner'
import Course from 'App/Models/Course'

test.group('Courses find', () => {
  test('find course by id', async ({ client }) => {
    const course = await Course.create({ name: 'Best course', description: 'Best course' })

    const response = await client.get(`courses/${course.id}`)

    response.assertBodyContains(course.toJSON())
  })

  test('not find course', async ({ client }) => {
    const response = await client.get('courses/sad2na2ns')

    response.assertStatus(404)
  })
})
