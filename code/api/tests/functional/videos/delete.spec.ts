import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

test.group('Delete video', () => {
  test('Delete video', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Best course', ownerId: user?.username })
    const section = await CourseSection.create({ name: 'Part 1', courseId: course.id })
    const video = await Video.create({ name: 'Introduction', courseSectionId: section.id })

    const response = await client.delete(`/courses/${course.id}/${video.id}`).loginAs(user!)

    response.assertStatus(200)
  })
})
