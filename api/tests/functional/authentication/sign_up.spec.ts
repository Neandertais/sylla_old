import { test } from '@japa/runner'

test.group('Authentication sign up', () => {
  test('do not create user case if username is not sent', async ({ client }) => {
    const response = await client.post('/signup').json({
      username: '',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado@gmail.com',
    })

    response.assertStatus(422)
  })

  test('do not create user case if email is not sent', async ({ client }) => {
    const response = await client.post('/signup').json({
      username: '',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado@gmail.com',
    })

    response.assertStatus(422)
  })

  test('do not create user case if password is not sent', async ({ client }) => {
    const responsePassword = await client.post('/signup').json({
      username: 'grilario',
      password: '',
      email: 'luisfernado@gmail.com',
    })

    const responseConfirmation = await client.post('/signup').json({
      username: 'grilario',
      password: '123456789',
      password_confirmation: '',
      email: 'luisfernado@gmail.com',
    })

    responsePassword.assertStatus(422)
    responseConfirmation.assertStatus(422)
  })

  test('create user', async ({ client }) => {
    const response = await client.post('/signup').json({
      username: 'Grilario',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado@gmail.com',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      user: {
        username: 'grilario',
        email: 'luisfernado@gmail.com',
      },
    })
  })
})
