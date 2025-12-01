import { RouterProvider } from 'react-router-dom'
import router from "./routes/Routes"
// import Chat from './components/Chat/Chat'
import { CurrentUserProvider } from "./Context/CurrentUserContext";
import { UnreadCountProvider } from './Context/unreadCountContext';
import { NotificationProvider } from './Context/NotificationContext';

function App() {

  return (
    <>
  
    <UnreadCountProvider> 
       <NotificationProvider>
    <RouterProvider router={router}/> 
     </NotificationProvider>
    </UnreadCountProvider>
  
    </>
  )
}

export default App
