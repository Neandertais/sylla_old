import Route from "@ioc:Adonis/Core/Route";

import authenticationRouter from "App/Modules/Authentication/routes";
import usersRouter from "App/Modules/Users/routes";
import "App/Modules/Courses/routes";
import "App/Modules/CourseSections/routes";
import "App/Modules/Videos/routes";

Route.group(() => {
  Route.group(() => {
    authenticationRouter();
    usersRouter();
  }).prefix("v1");
}).prefix("api");
