import Route from "@ioc:Adonis/Core/Route";

export default function coursesRouter() {
  Route.group(() => {
    Route.resource("courses", "CoursesController")
      .apiOnly()
      .middleware({ store: ["auth"], update: ["auth"], destroy: ["auth"] });
  }).namespace("App/Modules/Courses");
}
