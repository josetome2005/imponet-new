import "./AdminMarcas.css"
import { useState } from "react"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"

export function AdminMarcas() {

    const [marcas, setMarcas] = useState([])
    
    return (

        <div className="admin__section admin__marcas">
            <SectionTitle 
                title={"Marcas"}
                subtitle={`${marcas.length} marcas registradas`}
                buttonText={"Nueva Marca"}/>
        </div>
    )

}