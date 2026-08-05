import { useState } from "react"
import "./AdminDashboard.css"
import { NavLink, Outlet } from "react-router-dom"

const sections = [
    { label: "Dashboard",  value: "dashboard",  icon: "dashboard",  to: "/admin" },
    { label: "Productos",  value: "productos",  icon: "package_2",  to: "/admin/productos" },
    { label: "Categorías", value: "categorias", icon: "stacks",     to: "/admin/categorias" },
    { label: "Marcas",     value: "marcas",     icon: "sell",       to: "/admin/marcas" },
]

export function AdminDashboard(){
 
    return(

        <div className="admin__dashboard">
            
            <div className="menu">
                <div className="menu__header">
                    <h3>Imponet</h3>
                    <span>Admin</span>
                </div>
                <nav>
                    {
                        sections?.map(s => (
                            <NavLink 
                                key={s.value}
                                to={s.to}
                                end={s.to === "/admin"}
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="nav_link">
                                    <span className="material-symbols-outlined icon">
                                        {s.icon}
                                    </span> 
                                    {s.label}
                                </div>
                            </NavLink>
                        ))
                    }
                </nav>
            </div>

            <div className="content">
                <div className="content__header"></div>
                <Outlet />
            </div>

        </div>

    )

}