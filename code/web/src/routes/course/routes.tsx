import { RouteObject } from "react-router-dom";

import Course from "@routes/course";
import Settings from "@routes/course/Settings";
import SettingsVideos from "@routes/course/SettingsVideos";
import UploadVideo from "@routes/course/UploadVideo";
import Create from "@routes/course/Create";

const routes: RouteObject[] = [
  {
    path: "/course/:id",
    element: <Course />,
  },
  {
    path: "/course/:id/settings",
    element: <Settings />,
  },
  {
    path: "/course/:id/settings/videos",
    element: <SettingsVideos />,
  },
  {
    path: "/course/:id/settings/upload",
    element: <UploadVideo />,
  },
  {
    path: "/course/create",
    element: <Create />,
  },
];

export default routes;
