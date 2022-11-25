import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Authentication sign in', (group) => {
  group.setup(async () => {
    await User.create({
      username: 'luisfernandinho',
      email: 'luisfernandinho@mail.com',
      password: 'luisfernandinho',
    })
  })

  test('not login if not send username or email', async ({ client }) => {
    const response = await client.post('/login').json({ password: '123456789' })

    response.assertStatus(422)
  })

  test('login with username', async ({ client }) => {
    const response = await client
      .post('/login')
      .json({ username: 'luisfernandinho', password: 'luisfernandinho' })

    response.assertBodyContains({
      token: {
        type: 'bearer',
      },
    })
    response.assertStatus(200)
  })

  test('login with email', async ({ client }) => {
    const response = await client
      .post('/login')
      .json({ email: 'luisfernandinho@mail.com', password: 'luisfernandinho' })

    response.assertBodyContains({
      token: {
        type: 'bearer',
      },
    })
    response.assertStatus(200)
  })
})
