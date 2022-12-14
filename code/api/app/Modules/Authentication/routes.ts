import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/signup', 'AuthenticationController.signUp')
  Route.post('/login', 'AuthenticationController.signIn')
  Route.get('/logout', 'AuthenticationController.logOut')
  Route.get('auth/check', 'AuthenticationController.check')
}).namespace('App/Modules/Authentication')
