import { useState } from 'react'
import Home from './pages/home/home'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Authentication from "./pages/Authentication/authentication"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home></Home>}/>
      <Route path='/Authentication' element={<Authentication></Authentication>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
