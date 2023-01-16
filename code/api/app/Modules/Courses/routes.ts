import Route from "@ioc:Adonis/Core/Route";

export default function coursesRouter() {
  Route.group(() => {
    Route.resource("courses", "CoursesController")
      .apiOnly()
      .middleware({ store: ["auth"], update: ["auth"], destroy: ["auth"] });
    Route.post("courses/:id/buy", "CoursesController.buy")
      .as("courses.buy")
      .middleware(["auth"]);
  }).namespace("App/Modules/Courses");
}
