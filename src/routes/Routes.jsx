import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login/Login"
import Register from "../pages/Auth/Register/Register"
import MainLayout from "../layouts/MainLayout"
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
        path:"/app",
        element:<MainLayout/>,
    }
])

export default router;
