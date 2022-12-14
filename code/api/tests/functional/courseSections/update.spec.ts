import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'
import User from 'App/Models/User'

test.group('Course sections update', () => {
  test('update section', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })
    const section = await CourseSection.create({ name: 'Introduction', courseId: course.id })

    const response = await client
      .patch(`/courses/${course.id}/sections/${section.id}`)
      .json({ name: 'The Introduction' })
      .loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'The Introduction',
    })
  })

  test('not update section if not owner course', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course' })
    const section = await CourseSection.create({ name: 'Introduction', courseId: course.id })

    const response = await client
      .patch(`/courses/${course.id}/sections/${section.id}`)
      .json({ name: 'The Introduction' })
      .loginAs(user!)

    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Unauthorized',
    })
  })

  test('return not found if course or section not exists', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course' })
    const section = await CourseSection.create({ name: 'Introduction', courseId: course.id })

    const response1 = await client
      .patch(`/courses/unknown/sections/${section.id}`)
      .json({ name: 'The Introduction' })
      .loginAs(user!)

    const response2 = await client
      .patch(`/courses/${course.id}/sections/unknown`)
      .json({ name: 'The Introduction' })
      .loginAs(user!)

    response1.assertStatus(404)
    response2.assertStatus(404)
  })
})
