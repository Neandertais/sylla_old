import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

test.group('Videos find', () => {
  test('find user by id', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Javascript Course', ownerId: user?.username })
    const section = await CourseSection.create({ name: 'Introduction', courseId: course.id })
    const video = await Video.create({ name: 'Hello mens', courseSectionId: section.id })

    const response = await client.get(`courses/${course.id}/${video.id}`).loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Hello mens',
      course_section_id: section.id,
    })
  })
})
