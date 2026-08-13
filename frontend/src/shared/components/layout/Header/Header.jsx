import { useMemo, useState } from "react"
import "./Header.css"
import { useNavigate } from "react-router-dom"
import { useCarrito } from "../../../contexts/CarritoContext"
import { SearchBar } from "../../ui/SearchBar/SearchBar"


export function Header(){

    const [categorias, setCategorias] = useState([
        {
            id: crypto.randomUUID(),
            name: "Drones",
            label: "Drones"
        },
        {
            id: crypto.randomUUID(),
            name: "Parlantes",
            label: "Parlantes"
        },
        {
            id: crypto.randomUUID(),
            name: "Auriculares",
            label: "Auriculares"
        },
        {
            id: crypto.randomUUID(),
            name: "Notebooks",
            label: "Notebooks"
        },
        {
            id: crypto.randomUUID(),
            name: "Relojes",
            label: "Relojes"
        },
    ])

    const navigate = useNavigate()
    const { cantidadTotal } = useCarrito()
    
    return(

        <>

            <div className="top__header">
                <span className="material-symbols-outlined icon">
                    chat_bubble
                </span>
                <a href="">Contacto</a>
            </div>

            <header className="header">
                <img src="/img/resources/logo.png" alt="Logo Imponet" className="header__logo" onClick={() => navigate("/")}/>

                <SearchBar/>


                <div className="cart__container" onClick={() => navigate("/cart")}>
                    <span className="material-symbols-outlined icon">
                        shopping_cart
                    </span>
                    <span className="cart__amount">{cantidadTotal}</span>
                </div>

            </header>

            <div className="bottom__header">
                <span className="link__products">Productos</span>

                <div className="flex--32 y-center ">
                    {
                        categorias?.map(c => (
                            <span key={c.id}>
                                {c.label}
                            </span>
                        ))
                    }
                </div>
            </div>
            

        </>

    )

}