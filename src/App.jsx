import { RouterProvider } from 'react-router-dom'
import router from "./routes/Routes"
// import Chat from './components/Chat/Chat'

function App() {

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
