import { test } from '@japa/runner'
import Course from 'App/Models/Course'
import Section from 'App/Models/Section'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

test.group('Videos update', () => {
  test('update video by id', async ({ client }) => {
    const user = await User.find('mateus')
    const course = await Course.create({ name: 'Javascript Course', ownerId: user?.username })
    const section = await Section.create({ name: 'Introduction', courseId: course.id })
    const video = await Video.create({ name: 'Hello mens', sectionId: section.id })

    const response = await client
      .patch(`courses/${course.id}/${video.id}`)
      .json({
        name: 'Creating the Adonis APP',
        description: 'Creating Adonis App with adonis 5',
      })
      .loginAs(user!)

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Creating the Adonis APP',
      description: 'Creating Adonis App with adonis 5',
    })
  })
})
