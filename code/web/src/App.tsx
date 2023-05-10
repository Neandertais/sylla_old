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
import CreateCourse from "@routes/CreateCourse";
import Settings from "@routes/Settings";

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
            <EditProfile />
          </AuthProtected>
        ),
      },
      {
        path: "/u/:username",
        element: <Profile />,
      },
      {
        path:"course/create",
        element: <CreateCourse/>,
      },
      {
        path:"settings",
        element:<Settings/>
      }
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
