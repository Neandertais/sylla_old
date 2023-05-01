import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AppAntd } from "antd";

import AuthProvider, {
  AuthProtected,
  AuthRedirect,
} from "./contexts/Authentication";

import Layout from "@components/Layout";

import Home from "@routes/Home";
import SignUp from "@routes/SignUp";
import SignIn from "@routes/SignIn";
import Profile from "@routes/Profile";
import EditProfile from "@routes/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/settings/profile",
        element: (
          <AuthProtected>
            <EditProfile />{" "}
          </AuthProtected>
        ),
      },
      {
        path: "/u/:id",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <AuthRedirect>
        <SignUp />
      </AuthRedirect>
    ),
  },
  {
    path: "/signin",
    element: (
      <AuthRedirect>
        <SignIn />
      </AuthRedirect>
    ),
  },
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
