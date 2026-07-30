import "./AdminCategorias.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { useState } from "react"

export function AdminCategorias() {

    const [categorias, setCategorias] = useState([])

    return (

        <div className="admin__section admin__categorias">
            <SectionTitle 
                title={"Categorías"}
                subtitle={`${categorias.length} categorias activas`}
                buttonText={"Nueva Categoria"}/>
        </div>
    )

}