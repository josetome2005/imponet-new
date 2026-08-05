import "./AdminCategorias.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { useEffect, useState } from "react"
import { getCategorias, getCategoriasConCantidad } from "../../shared/services/categorias.services"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { searchFields, categorias_columns } from "./data/categorias.config"

export function AdminCategorias() {

    const [categorias, setCategorias] = useState([])
    
    useEffect(() => {
        async function getCtgs(){

            const ctgs = await getCategoriasConCantidad()
            setCategorias(ctgs)
        }
        getCtgs()
    }, [])


    console.log(categorias)

    return (

        <div className="admin__section admin__categorias">
            <SectionTitle 
                title={"Categorías"}
                subtitle={`${categorias.length} categorias activas`}
                buttonText={"Nueva Categoria"}/>

            <TableContainer
                data={categorias}
                columns={categorias_columns}
                searchFields={searchFields}
                placeholderInput={"Buscar por nombre"}
                messageNoSearch={"No tienes categorías"}/>
        </div>
    )

}