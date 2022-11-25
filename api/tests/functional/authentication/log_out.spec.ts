import { test } from '@japa/runner'

test.group('Authentication log out', () => {
  test('log out', async ({ client }) => {
    const response = await client.get('/logout')

    response.assertBody({
      revoked: true,
    })
  })
})
