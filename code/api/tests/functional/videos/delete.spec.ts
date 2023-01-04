import { test } from '@japa/runner'
import { UserFactory, VideoFactory } from 'Database/factories'

test.group('Delete video', () => {
  test('Delete video', async ({ client }) => {
    const user = await UserFactory.create()
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.merge({ ownerId: user?.username }))
    ).create()

    const response = await client
      .delete(`/courses/${video.section.course.id}/${video.id}`)
      .loginAs(user!)

    response.assertStatus(200)
  })

  test('not delete video if user not owner', async ({ client }) => {
    const user = await UserFactory.create()
    const secondUser = await UserFactory.create()
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.merge({ ownerId: secondUser.username }))
    ).create()

    const response = await client
      .delete(`/courses/${video.section.course.id}/${video.id}`)
      .loginAs(user)

    response.assertStatus(401)
  })
})
