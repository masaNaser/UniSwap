import { RouterProvider } from 'react-router-dom'
import router from "./routes/Routes"
// import Chat from './components/Chat/Chat'
import { CurrentUserProvider } from "./Context/CurrentUserContext";
import { UnreadCountProvider } from './Context/unreadCountContext';

function App() {

  return (
    <>
    <UnreadCountProvider>
    <RouterProvider router={router}/>
    </UnreadCountProvider>
    </>
  )
}

export default App
