import "./CategoriasDestacadas.css"
import { useState } from "react"
import { CategoriaItem } from "../CategoriaItem/CategoriaItem"
import { Button } from "../../../../shared/components/ui/Button/Button"
import { useNavigate } from "react-router-dom"

const categorias_local = [
    {
        name: "Auriculares",
        meta_categoria: "Audio",
        img: "/img/categorias/auriculares.png"
    },
    {
        name: "Drones",
        meta_categoria: "Entrenimiento",
        img: "/img/categorias/drones.png"
    },
    {
        name: "Parlantes",
        meta_categoria: "Audio",
        img: "/img/categorias/parlantes.png"
    },
    {
        name: "Smartwatchs",
        meta_categoria: "Utilidad",
        img: "/img/categorias/smartwatchs.png"
    },
]

export function CategoriasDestacadas(){

    const [categorias, setCategorias] = useState(categorias_local)
    const navigate = useNavigate()

    const handleNavigate = (path) => {
        navigate(path)
        window.scrollTo({top: 0})
    }

    return(

        <div className="categorias__destacadas">
            
            <h3 className="section__title">Explora nuestras categorías destacadas</h3>
            <p className="section__subtitle">Todo lo que necesitás, organizado como corresponde</p>

            <div className="categorias__container">
                {
                    categorias?.map(c => 
                        <CategoriaItem key={c.name} categoria={c}/>
                    )
                }
            </div>
            
            <div className="button__container">
                <Button 
                    text={"Explorar más"}
                    onClick={() => handleNavigate("/productos")}/>
            </div>
        </div>

    )

}