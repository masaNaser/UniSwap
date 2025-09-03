
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
