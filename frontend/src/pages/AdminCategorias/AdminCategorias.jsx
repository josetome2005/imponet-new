import "./AdminCategorias.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { useEffect, useState } from "react"


export function AdminCategorias() {

    const [categorias, setCategorias] = useState([])
    
    useEffect(() => {

        async function getCtgs(){

            const ctgs = await getCategorias()

        }


    }, [])

    return (

        <div className="admin__section admin__categorias">
            <SectionTitle 
                title={"Categorías"}
                subtitle={`${categorias.length} categorias activas`}
                buttonText={"Nueva Categoria"}/>
        </div>
    )

}