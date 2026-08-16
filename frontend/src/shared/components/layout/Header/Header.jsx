import { useEffect, useState } from "react"
import "./Header.css"
import { Link, useNavigate } from "react-router-dom"
import { useCarrito } from "../../../contexts/CarritoContext"
import { SearchBar } from "../../ui/SearchBar/SearchBar"
import { getCategoriasDestacadas } from "../../../services/categorias.services"

export function Header(){

    const [categorias, setCategorias] = useState()

    useEffect(() => {
        async function fetchCategorias(){
            const data = await getCategoriasDestacadas()
            const categoriasDestacadas = data
                .slice()
                .sort((a, b) => b.cantidad_productos - a.cantidad_productos)
                .slice(0, 5)
            setCategorias(categoriasDestacadas)
        }
        fetchCategorias()
    }, [])

    const navigate = useNavigate()
    const { cantidadTotal } = useCarrito()
    
    const telefono = 3513747022;

    return(

        <>

            <div className="top__header">
                <span className="material-symbols-outlined icon">
                    chat_bubble
                </span>
                <a href={`https://wa.me/${telefono}`} target="_blank">Contacto</a>
            </div>

            <header className="header">
                <img src="/img/resources/logo.png" alt="Logo Imponet" className="header__logo" onClick={() => navigate("/")}/>

                <SearchBar/>

                <div className="flex--24">
                    <span className="seguir__compra">
                        <Link to={"/order"}>Seguí tu compra</Link>
                    </span>

                    <div className="cart__container" onClick={() => navigate("/cart")}>
                        <span className="material-symbols-outlined icon">
                            shopping_cart
                        </span>
                        <span className="cart__amount">{cantidadTotal}</span>
                    </div>
                </div>
                

            </header>

            <div className="bottom__header">
                
                    <span className="link__products">
                        <Link to={`/productos`}>
                            Explorar Productos
                        </Link>
                    </span>
                

                <div className="flex--32 y-center ">
                    {
                        categorias?.map(c => (
                            <Link key={c.id} to={`/productos?categoria=${c.slug}`}>
                                <span>
                                    {c.nombre}
                                </span>
                            </Link>
                            
                        ))
                    }
                </div>
            </div>
            

        </>

    )

}