import { useNavigate } from "react-router-dom"
import "./CategoriaItem.css"

export function CategoriaItem({categoria}){

    const navigate = useNavigate()

    const handleNavigate = (path) => {
        navigate(path)
        window.scrollTo({top: 0})
    }

    return(

        <div className="categoria__item" onClick={() => handleNavigate(`/productos?categoria=${categoria.slug}`)}>
            
            <div className="img__container">
                <img src={categoria.img} alt={categoria.name} />
            </div>
            <span className="categoria__name">{categoria.name}</span>
            <span className="categoria__cta">Explorar</span>
        </div>

    )

}