import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('users/:username', 'UserController.userInfo')
  Route.patch('users/:username', 'UserController.userEdit')
}).namespace('App/Modules/User')
