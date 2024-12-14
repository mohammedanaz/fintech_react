import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import UserRoutes from './routes/user/UserRoutes';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes/>} />
      </Routes>
    </Router>
  )
}

export default App
