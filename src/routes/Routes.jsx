import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import MainLayout from "../layouts/MainLayout";
import Feed from "../pages/Home/Feed/Feed";
import Services from "../pages/Home/Browse/Services";
import SubServices from "../pages/Home/Browse/SubServices";
import SubServiceProjects from "../pages/Home/Browse/SubServiceProjects";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import Project from "../pages/Home/Project/Project";
import ResetPassword from "../pages/Auth/ResetPassword";
import LandingPage from "../pages/LandingPage/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,   // ✅ صح
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        path: "feed",
        element: <Feed />,
      },
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
      },
      {
        path: "project",
        element: <Project />,
      },
    ],
  },
]);

export default router;
