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
import ProjectDetails from "../pages/Home/Browse/ProjectDetails"; 
import Project from "../pages/Home/Project/Project";
import Profile from "../pages/Profile/Profile";
import ChatPage from '../components/Chat/ChatPage'
import TrackTasks from "../pages/TrackTasks/TrackTasks";
import AdminDashboard from "../pages/Admin/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />, 
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
    path: "/Chat",
    element:<ChatPage/>,
  },
  {
      path:"/admin",
      element: <AdminDashboard/>
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
        path: "project/:id", 
        element: <ProjectDetails />,
      },
      {
        path: "project", 
        element: <Project />, 
      },
      {
        path: "profile", 
        element: <Profile/>, 
      },
        {
        path: "profile/:userId", 
        element: <Profile/>, 
      },
       {
        path: "TrackTasks/:taskId", 
        element: <TrackTasks/>, 
      },
    ],
  },
]);

export default router;
