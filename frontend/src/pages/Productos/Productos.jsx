import { Footer } from "../../shared/components/layout/Footer/Footer"
import { Header } from "../../shared/components/layout/Header/Header"
import { useSearchParams } from "react-router-dom"
import { SelectOption } from "../../shared/components/forms/inputs/SelectOption/SelectOption"
import "./Productos.css"
import { useState } from "react"

const order_options = [
    {
        id: crypto.randomUUID(),
        label: "Menor Precio",
        value: "Menor Precio"
    },
    {
        id: crypto.randomUUID(),
        label: "Mayor Precio",
        value: "Mayor Precio"
    },
    {
        id: crypto.randomUUID(),
        label: "Nombre Asc",
        value: "Nombre Asc"
    },
    {
        id: crypto.randomUUID(),
        label: "Nombre Desc",
        value: "Nombre Desc"
    },
]


export function Productos(){

    const [searchParams] = useSearchParams()
    const [activeOrderOption, setActiveOrderOption] = useState()

    const marca = searchParams.get("marca")
    const categoria = searchParams.get("categoria")
    const page = searchParams.get("page") ?? 1
    
    const handleChangeOrder = (item) => {
        setActiveOrderOption(item.value)
    }

    return(

        <>
            <Header />

            <div className="productos">

                <div className="productos__header">
                    <h3>{categoria}</h3>

                    <div className="select__order">
                        <span>Ordenar por: </span>
                        <div className="select__container">
                            <SelectOption 
                                name_input={"order"}
                                activeOption={activeOrderOption}
                                options={order_options}
                                defaultText={"Seleccionar"}
                                onSelect={handleChangeOrder}
                                />
                        </div>
                    </div>
                </div>  

                <div className="productos__layout">

                    <div className="filters">

                        

                    </div>

                </div>

            </div>

            <Footer/>
        </>

    )

}