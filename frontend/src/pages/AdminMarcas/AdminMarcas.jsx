import "./AdminMarcas.css"
import { useEffect, useState } from "react"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { getMarcasConCantidad } from "../../shared/services/marcas.services"
import { MarcaItem } from "./components/MarcaItem/MarcaItem"

export function AdminMarcas() {

    const [marcas, setMarcas] = useState([])

    useEffect(() => {
        async function getMs(){
            const ms = await getMarcasConCantidad()
            setMarcas(ms)
        }
        getMs()
    }, [])
    
    return (

        <div className="admin__section admin__marcas">
            <SectionTitle 
                title={"Marcas"}
                subtitle={`${marcas.length} marcas registradas`}
                buttonText={"Nueva Marca"}/>

            <div className="admin__marcas__container">
                {
                    marcas?.map(m => (
                        <MarcaItem 
                            marca={m}/>
                    ))
                }
            </div>
        </div>
    )

}