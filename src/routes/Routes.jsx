import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login"
import Register from "../pages/Auth/Register/Register"
import MainLayout from "../layouts/MainLayout"
import Feed from "../pages/Home/Feed/Feed"
<<<<<<< HEAD
import Services from "../pages/Home/Browse/Services"
import SubServices from "../pages/Home/Browse/SubServices"
import SubServiceProjects from "../pages/Home/Browse/SubServiceProjects"


=======
import ForgetPassword from "../pages/Auth/Login/ForgetPassword";
import Project from "../pages/Home/Project/Project";
>>>>>>> 2de60989959de5783ab9238d2504ec21d13f8031
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
<<<<<<< HEAD
      {
        path: "browse",
        element: <Services />,
      },
      {
        path: "browse/:categoryName",
        element: <SubServices />,
      },
      {
      path: "services/:subserviceName",
      element: <SubServiceProjects />,
      }
=======
         {
        path: "project", 
        element: <Project />
      },
>>>>>>> 2de60989959de5783ab9238d2504ec21d13f8031
    ],
  },
])

export default router;
