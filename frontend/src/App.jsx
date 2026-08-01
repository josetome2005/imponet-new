import './App.css'
import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from './shared/components/ui/ProtectedRoute/ProtectedRoute'
import { HomeDashboard } from './pages/Home/HomeDashboard'
import { Productos } from './pages/Productos/Productos'
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard'
import { AdminHome } from "./pages/AdminHome/AdminHome"
import { AdminProductos } from "./pages/AdminProductos/AdminProductos"
import { AdminMarcas } from "./pages/AdminMarcas/AdminMarcas"
import { AdminCategorias } from "./pages/AdminCategorias/AdminCategorias"
import { Login } from './pages/Login/Login'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/productos" element={<Productos />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path='productos' element={<AdminProductos/>} />
          <Route path='marcas' element={<AdminMarcas />} />
          <Route path='categorias' element={<AdminCategorias />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="*" element={<HomeDashboard />} />
    </Routes>
  )
}

export default App
