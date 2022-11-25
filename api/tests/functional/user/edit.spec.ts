import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('User edit', () => {
  test('not edit user if not logged', async ({ client }) => {
    const response = await client.patch('/users/mateus')

    response.assertStatus(401)
  })

  test('edit user', async ({ client, assert }) => {
    const user = await User.find('mateus')
    assert.notEmpty(user)
    if (!user) return

    const userInfo = {
      username: 'grilario1234',
      name: 'Luis Fernando',
      bio: 'Programmer Javascript',
    }

    const response = await client.patch('/users/mateus').loginAs(user).json(userInfo)

    response.assertStatus(200)
    response.assertBodyContains(userInfo)
  })
})
