import "./AdminProductos.css"
import { useState } from "react"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"

export function AdminProductos() {

    const [productos, setProductos] = useState([])
    
    return (

        <div className="admin__section admin__productos">
            <SectionTitle 
                title={"Productos"}
                subtitle={`${productos.length} productos en tu catálogo.`}
                buttonText={"Nuevo Producto"}/>
        </div>
    )

}