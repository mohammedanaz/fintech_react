import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import UserRoutes from './routes/user/UserRoutes';
import {SnackbarProvider} from "notistack";

function App() {
  const [count, setCount] = useState(0)

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{vertical: "top", horizontal: "center"}}
    >
      <Router>
        <Routes>
          <Route path="/*" element={<UserRoutes/>} />
        </Routes>
      </Router>
    </SnackbarProvider>
  )
}

export default App
