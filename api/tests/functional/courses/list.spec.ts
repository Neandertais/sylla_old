import { test } from '@japa/runner'
import Course from 'App/Models/Course'

test.group('Courses list', () => {
  test('list courses by username', async ({ client }) => {
    await Course.createMany([
      { name: 'Javascript course', ownerId: 'mateus' },
      { name: 'Adonis the course', ownerId: 'mateus' },
    ])

    const response = await client.get('users/mateus/courses')

    response.assertStatus(200)
    response.assertBodyContains([
      { name: 'Javascript course', owner_id: 'mateus' },
      { name: 'Adonis the course', owner_id: 'mateus' },
    ])
  })

  test('not list courses if user not exists', async ({ client }) => {
    const response = await client.get('users/unknown/courses')

    response.assertStatus(404)
  })
})
