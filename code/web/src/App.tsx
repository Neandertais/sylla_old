import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AppAntd } from "antd";

import AuthProvider from "./contexts/Authentication";

import Home from "./routes/Home";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import ShowProfile from "./routes/ShowProfile";
import EditProfile from "./routes/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/showprofile",
    element: <ShowProfile/>
  },
  {
    path: "/editprofile",
    element: <EditProfile/>
  }
 
])

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
