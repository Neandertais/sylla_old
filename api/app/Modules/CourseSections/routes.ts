import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('courses/:course/sections', 'CourseSectionsController.createSection').middleware([
    'auth',
  ])
  Route.get('courses/:course/sections', 'CourseSectionsController.listSections')
  Route.patch('courses/:course/sections/:id', 'CourseSectionsController.updateSection').middleware([
    'auth',
  ])
  Route.delete('courses/:course/sections/:id', 'CourseSectionsController.deleteSection').middleware(
    ['auth']
  )
}).namespace('App/Modules/CourseSections')
