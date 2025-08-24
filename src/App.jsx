import './App.css'
import Login from "../src/pages/Auth/Login/Login"
import Register from './pages/Auth/Register/Register'
import Navbar from "./components/Navbar/Navbar"
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
