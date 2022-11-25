import { test } from '@japa/runner'

test.group('User find', () => {
  test('find user by username', async ({ client }) => {
    const response = await client.get('users/mateus')

    response.assertStatus(200)
  })

  test('not find user', async ({ client }) => {
    const response = await client.get('users/mateus123')

    response.assertStatus(404)
    response.assertBodyContains({
      errors: [
        {
          title: 'Resource not found',
        },
      ],
    })
  })
})
