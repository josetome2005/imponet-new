import "./CategoriasDestacadas.css"
import { useEffect, useState } from "react"
import { CategoriaItem } from "../CategoriaItem/CategoriaItem"
import { Button } from "../../../../shared/components/ui/Button/Button"
import { useNavigate } from "react-router-dom"
import { getCategoriasDestacadasConImagen } from "../../../../shared/services/categorias.services"
import { API_URL } from "../../../../shared/services/http.services"
import { Skeleton } from "../../../../shared/components/ui/Skeleton/Skeleton"

function CategoriaSkeleton(){
    return(
        <div className="categoria__item">

            <div className="img__container">
                <Skeleton height="100%" style={{aspectRatio: "9 / 10"}}/>
            </div>
            <Skeleton width="150px" height="1.375rem" />
            <Skeleton width="75px" height="0.925rem"/>
        </div>
    )
}

export function CategoriasDestacadas(){

    const navigate = useNavigate()

    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)
    
    useEffect(() => {
        async function fetchCategorias() {
            setNotFound(false)
            setLoading(true)
            try{
                const data = await getCategoriasDestacadasConImagen()
                const cats = data.map(c => ({
                    name: c.nombre,
                    img: c.imagen ? `${API_URL}${c.imagen}` : "/img/placeholder-categoria.png"
                }))
                setCategorias(cats)
            }catch(e){
                setNotFound(true)
                console.log(e)
            }finally{
                setLoading(false)
            }
           
        }
        fetchCategorias()
    }, [])


    const handleNavigate = (path) => {
        navigate(path)
        window.scrollTo({top: 0})
    }

    if(notFound) return

    return(

        <div className="categorias__destacadas">
            
            <h3 className="section__title">Explora nuestras categorías destacadas</h3>
            <p className="section__subtitle">Todo lo que necesitás, organizado como corresponde</p>

            <div className="categorias__container">
                {loading
                    ?
                        Array.from({ length: 4 }).map((_, i) => (<CategoriaSkeleton key={i}/>))
                    :
                        categorias?.map(c => 
                            <CategoriaItem key={c.name} categoria={c}/>
                        )
                }
            </div>
            
            <div className="button__container">
                <Button 
                    text={"Explorar más"}
                    onClick={() => handleNavigate("/productos")}
                    disabled={loading}/>
            </div>
        </div>

    )

}