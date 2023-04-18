import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AppAntd } from "antd";

import Home from "./routes/Home";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";

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
  }
]);

export default function App() {
  return (
    <ConfigProvider>
      <AppAntd>
        <RouterProvider router={router} />
      </AppAntd>
    </ConfigProvider>
  )
} 
