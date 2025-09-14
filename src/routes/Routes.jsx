import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login"
import Register from "../pages/Auth/Register/Register"
import MainLayout from "../layouts/MainLayout"
import Feed from "../pages/Home/Feed/Feed"
import ForgetPassword from "../pages/Auth/Login/ForgetPassword";
import Project from "../pages/Home/Project/Project";
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
      path:'/forgetPassword',
      element: <ForgetPassword/>
    },
     {
    path: "/", 
    element: <MainLayout />,
    children: [
      {
        path: "feed", 
        element: <Feed />,
      },
         {
        path: "project", 
        element: <Project />
      },
    ],
  },
])

export default router;
