import Route from "@ioc:Adonis/Core/Route";

import authenticationRouter from "App/Modules/Authentication/routes";
import coursesRouter from "App/Modules/Courses/routes";
import sectionsRouter from "App/Modules/Sections/routes";
import usersRouter from "App/Modules/Users/routes";
import videosRouter from "App/Modules/Videos/routes";

Route.group(() => {
  Route.group(() => {
    authenticationRouter();
    usersRouter();
    coursesRouter();
    sectionsRouter();
    videosRouter();
  }).prefix("v1");
}).prefix("api");
