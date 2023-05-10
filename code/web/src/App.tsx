import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AppAntd } from "antd";

import Layout from "@components/Layout";
import AuthProvider from "@contexts/Authentication";

import Home from "@routes/Home";
import AuthRoutes from "@routes/auth/routes";
import CourseRoutes from "@routes/course/routes";
import ProfileRoutes from "@routes/profile/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      ...CourseRoutes,
      ...ProfileRoutes,
    ],
  },
  ...AuthRoutes,
]);

export default function App() {
  return (
    <ConfigProvider>
      <AppAntd>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AppAntd>
    </ConfigProvider>
  );
}
