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
      username: 'grilario',
      password: '123456789',
      password_confirmation: '123456789',
      email: '',
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

  test('not create user with same username', async ({ client }) => {
    const response = await client.post('/signup').json({
      username: 'Grilario Tuts',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado23@gmail.com',
    })

    const responseSame = await client.post('/signup').json({
      username: 'Grilario Tuts',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado2@gmail.com',
    })

    response.assertStatus(201)
    responseSame.assertStatus(409)
  })

  test('not create user with same email', async ({ client }) => {
    const response = await client.post('/signup').json({
      username: 'Grilario 2.0',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado2@gmail.com',
    })

    const responseSame = await client.post('/signup').json({
      username: 'Grilinho',
      password: '123456789',
      password_confirmation: '123456789',
      email: 'luisfernado2@gmail.com',
    })

    response.assertStatus(201)
    responseSame.assertStatus(409)
  })
})
