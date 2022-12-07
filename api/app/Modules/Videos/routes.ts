import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('courses/:course/upload', 'VideosController.createVideo').middleware(['auth'])
}).namespace('App/Modules/Videos')
