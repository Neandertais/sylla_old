import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('courses/:course/upload', 'VideosController.createVideo').middleware(['auth'])
  Route.get('courses/:course/:video', 'VideosController.findVideo').middleware(['auth'])
}).namespace('App/Modules/Videos')
