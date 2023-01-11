import Route from "@ioc:Adonis/Core/Route";

export default function usersRouter() {
  Route.group(() => {
    Route.resource("users", "UsersController")
      .paramFor("users", "username")
      .only(["show", "update"])
      .middleware({ update: ["auth"] });
  }).namespace("App/Modules/Users");
}
