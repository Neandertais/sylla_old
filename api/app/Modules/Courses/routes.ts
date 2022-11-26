import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('courses', 'CoursesController.createCourse').middleware(['auth'])
  Route.get('courses/:id', 'CoursesController.findCourse')
}).namespace('App/Modules/Courses')
