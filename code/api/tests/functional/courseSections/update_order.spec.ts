import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'
import User from 'App/Models/User'

test.group('Course sections update order', () => {
  test('update order of sections', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })

    const sectionBefore = await CourseSection.create({
      name: 'Arrays',
      position: 1,
      courseId: course.id,
    })
    await CourseSection.create({ name: 'Functions', position: 2, courseId: course.id })
    const section = await CourseSection.create({
      name: 'Objects',
      position: 3,
      courseId: course.id,
    })

    const response = await client
      .patch(`courses/${course.id}/sections`)
      .json({
        itemBefore: sectionBefore.id,
        item: section.id,
      })
      .loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      id: section.id,
      position: 2,
    })
  })

  test('update section for first', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })

    await CourseSection.create({
      name: 'Arrays',
      position: 1,
      courseId: course.id,
    })
    await CourseSection.create({ name: 'Functions', position: 2, courseId: course.id })
    const section = await CourseSection.create({
      name: 'Objects',
      position: 3,
      courseId: course.id,
    })

    const response = await client
      .patch(`courses/${course.id}/sections`)
      .json({
        itemBefore: null,
        item: section.id,
      })
      .loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      id: section.id,
      position: 1,
    })
  })

  test('not update order of sections if not owner course', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course' })

    const sectionBefore = await CourseSection.create({
      name: 'Arrays',
      position: 1,
      courseId: course.id,
    })
    await CourseSection.create({ name: 'Functions', position: 2, courseId: course.id })
    const section = await CourseSection.create({
      name: 'Objects',
      position: 3,
      courseId: course.id,
    })

    const response = await client
      .patch(`courses/${course.id}/sections`)
      .json({
        itemBefore: sectionBefore.id,
        item: section.id,
      })
      .loginAs(user!)

    response.assertStatus(401)
  })

  test('not update order of sections if course not exists', async ({ client }) => {
    const user = await User.find('mateus')

    const response = await client.patch(`courses/unknown/sections`).json({}).loginAs(user!)

    response.assertStatus(404)
  })

  test('not update order of sections if section not exists', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })

    const sectionBefore = await CourseSection.create({
      name: 'Arrays',
      position: 1,
      courseId: course.id,
    })
    await CourseSection.create({ name: 'Functions', position: 2, courseId: course.id })
    const section = await CourseSection.create({
      name: 'Objects',
      position: 3,
      courseId: course.id,
    })

    const response = await client
      .patch(`courses/${course.id}/sections`)
      .json({
        itemBefore: '123456789012',
        item: section.id,
      })
      .loginAs(user!)

    const response2 = await client
      .patch(`courses/${course.id}/sections`)
      .json({
        itemBefore: sectionBefore.id,
        item: '123456789012',
      })
      .loginAs(user!)

    response.assertStatus(404)
    response2.assertStatus(404)
  })
})
