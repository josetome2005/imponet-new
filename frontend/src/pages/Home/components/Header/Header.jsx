import { useState } from "react"
import "./Header.css"


export function Header(){

    const [cartAmount, setCardAmout] = useState(0)
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

    return(

        <>

            <div className="top__header">
                <span className="material-symbols-outlined icon">
                    chat_bubble
                </span>
                <a href="">Contacto</a>
            </div>

            <header className="header">
                <img src="/img/resources/logo.png" alt="Logo Imponet" className="header__logo"/>

                <div className="searchbar__container">
                    <input type="text" placeholder="Buscar por modelo, ej: Notebook Lenovo 15'" />
                    <span className="material-symbols-outlined">
                        search
                    </span>
                </div>


                <div className="cart__container">
                    <span className="material-symbols-outlined icon">
                        shopping_cart
                    </span>
                    <span className="cart__amount">{cartAmount}</span>
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