import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login"
import Register from "../pages/Auth/Register/Register"
import MainLayout from "../layouts/MainLayout"
import Feed from "../pages/Home/Feed/Feed"
const router = createBrowserRouter([
    // {
    //     path:'/',
    //     element: <LandingPage/>
    // },
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/register',
        element: <Register/>
    },
     {
    path: "/", 
    element: <MainLayout />,
    children: [
      {
        path: "feed", 
        element: <Feed />,
      },
    ],
  },
])

export default router;
