import Route from "@ioc:Adonis/Core/Route";

import authenticationRouter from "App/Modules/Authentication/routes";
import usersRouter from "App/Modules/Users/routes";
import coursesRouter from "App/Modules/Courses/routes";
import sectionsRouter from "App/Modules/Sections/routes";
import "App/Modules/Videos/routes";

Route.group(() => {
  Route.group(() => {
    authenticationRouter();
    usersRouter();
    coursesRouter();
    sectionsRouter();
  }).prefix("v1");
}).prefix("api");
