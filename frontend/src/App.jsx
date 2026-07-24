import './App.css'
import { HomeDashboard } from './pages/Home/HomeDashboard'
import { Route, Routes } from "react-router-dom"
import { Productos } from './pages/Productos/Productos'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="*" element={<HomeDashboard />} />
    </Routes>
  )
}

export default App
