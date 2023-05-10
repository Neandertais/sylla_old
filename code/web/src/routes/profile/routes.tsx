import { RouteObject } from "react-router-dom";

import Profile from "@routes/profile";
import Settings from "@routes/profile/Settings";

const routes: RouteObject[] = [
  {
    path: "/u/:username",
    element: <Profile />,
  },
  {
    path: "/u/settings",
    element: <Settings />,
  }
];

export default routes;
