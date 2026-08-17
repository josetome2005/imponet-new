import { useEffect, useState } from "react"
import "./ProtectedRoute.css"
import { getMe } from "../../../services/auth.services"
import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute(){

    const [status, setStatus] = useState("checking") // checking, authenticated, unauthenticated


    useEffect(() => {
        const checkAuth = async () => {
            const usuario = await getMe()
            setStatus(usuario ? "authenticated" : "unauthenticated")
        }
        checkAuth()
    }, [])

    //if (status === "checking") return <div className="loading-screen">Cargando...</div>
    if (status === "unauthenticated") return <Navigate to="/login" replace />

    return <Outlet />

}