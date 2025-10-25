import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import MainLayout from "../layouts/MainLayout";
import Feed from "../pages/Home/Feed/Feed";
import Services from "../pages/Home/Browse/Services";
import SubServices from "../pages/Home/Browse/SubServices";
import SubServiceProjects from "../pages/Home/Browse/SubServiceProjects";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import LandingPage from "../pages/LandingPage/LandingPage";
import ProjectDetails from "../pages/Home/Browse/ProjectDetails"; // Assuming the correct path

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
        path: "browse/:id",
        element: <SubServices />,
      },
      {
        path: "services/:id/projects",
        element: <SubServiceProjects />,
      },
      {
        path: "project/:id", // <-- Added :id parameter
        element: <ProjectDetails />, // <-- Used ProjectDetails component
      },
    ],
  },
]);

export default router;
