import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world! asda</div>,
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
    <RouterProvider router={router} />
    )
} 
