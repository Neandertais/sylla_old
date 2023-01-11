import Route from "@ioc:Adonis/Core/Route";

export default function sectionsRouter() {
  Route.group(() => {
    Route.shallowResource("courses.sections", "SectionsController")
      .apiOnly()
      .paramFor("courses", "course")
      .as("sections")
      .middleware({ store: ["auth"], update: ["auth"], destroy: ["auth"] });
    Route.post("sections/:id/reorder", "SectionsController.updateOrder")
      .as("section.reorder")
      .middleware(["auth"]);
  }).namespace("App/Modules/Sections");
}
