import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'

Route.get('/', async () => {
  return { message: 'The init config of project' }
})

Route.post('login', async ({ auth, request, response }) => {
  const { email, password } = request.only(['email', 'password'])

  try {
    const token = await auth.use('api').attempt(email, password)
    return token
  } catch {
    return response.unauthorized('Invalid credentials')
  }
})

Route.post('register', async ({ request, response }) => {
  const { username, email, password } = request.only(['email', 'password', 'username'])

  const user = new User()

  await user
    .fill({
      username,
      email,
      password,
    })
    .save()

  return user
})

Route.get('list', async () => {
  const users = await User.all()

  return users
})

Route.get('list/auth', async ({ auth }) => {
  const users = await User.all()

  return { loggedWith: auth.user?.username, users }
}).middleware('auth')
