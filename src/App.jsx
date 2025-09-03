<<<<<<< HEAD

=======
import './App.css'
import Login from "../src/pages/Auth/Login/Login"
import Register from './pages/Auth/Register/Register'
import Navbar from "./components/Navbar/Navbar"
import Feed from "./pages/Home/Feed/Feed"
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
import { RouterProvider } from 'react-router-dom'
import router from "./routes/Routes"
function App() {

  return (
    <>
    <RouterProvider router={router}/>
    {/* <Navbar/> */}
      {/* { <Login/> } */}
      {/* <Register/> */}
    </>
  )
}

export default App
