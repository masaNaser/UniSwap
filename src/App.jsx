import { RouterProvider } from 'react-router-dom'
import router from "./routes/Routes"
import Chat from './components/Chat/Chat'
function App() {

  return (
    <>
    <RouterProvider router={router}/>
     <div>
      <h2>تجربة الشات</h2>
     <Chat/>

    </div>
    </>
  )
}

export default App
