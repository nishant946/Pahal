
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Register from "./pages/auth/register"
import Login from "./pages/auth/login"




function App() {
  return (
    
      <BrowserRouter>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/about" element={<About />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App
