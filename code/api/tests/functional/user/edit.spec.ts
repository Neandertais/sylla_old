import { test } from '@japa/runner'
import { file } from '@ioc:Adonis/Core/Helpers'
import User from 'App/Models/User'
import Drive from '@ioc:Adonis/Core/Drive'

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

    const fakeAvatar = await file.generateJpg('1mb')

    const drive = Drive.fake()

    const response = await client
      .patch('/users/mateus')
      .loginAs(user)
      .file('avatar', fakeAvatar.contents, { filename: fakeAvatar.name })
      .fields(userInfo)

    drive.restore('local')

    response.assertStatus(200)
    response.assertBodyContains(userInfo)
  })
})
