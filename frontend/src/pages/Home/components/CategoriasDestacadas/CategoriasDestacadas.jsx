import "./CategoriasDestacadas.css"
import { useEffect, useState } from "react"
import { CategoriaItem } from "../CategoriaItem/CategoriaItem"
import { Button } from "../../../../shared/components/ui/Button/Button"
import { useNavigate } from "react-router-dom"
import { getCategoriasDestacadas, getCategoriasDestacadasConImagen } from "../../../../shared/services/categorias.services"
import { searchProductos } from "../../../../shared/services/productos.services"
import { API_URL } from "../../../../shared/services/http.services"

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

    const navigate = useNavigate()

    const [categorias, setCategorias] = useState()
    
    useEffect(() => {
        async function fetchCategorias() {
            const data = await getCategoriasDestacadasConImagen()
            const cats = data.map(c => ({
                name: c.nombre,
                img: c.imagen ? `${API_URL}${c.imagen}` : "/img/placeholder-categoria.png"
            }))
            setCategorias(cats)
        }
        fetchCategorias()
    }, [])


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