import { useEffect, useState } from "react"
import "./ProductosBajoStock.css"
import { getProductos } from "../../../../shared/services/productos.services"

export function ProductosBajoStock(){

    const [productos, setProductos] = useState([])

    useEffect(() => {
        async function fetchProd(){
            const data = await getProductos()
            const productos_bajo_stock = data.filter(p => p.stock <= 5)
            setProductos(productos_bajo_stock)
        }
        fetchProd()
    }, [])



    return(
        <div className="productos__bajo__stock admin__home__section">
            <div className="header__section flex--16">
                <span className="material-symbols-outlined icon">
                    warning
                </span>
                <h3>Productos con poco stock</h3>
            </div>

            <div className="productos">
                {
                    productos.map(p => (
                        <div className="producto__item">
                            <span className="producto__nombre">{p.nombre}</span>
                            <span className={`${p.stock === 0 ? "producto__cantidad agotado" : "producto__cantidad"}`}>
                                { p.stock === 0 ? "Agotado" : `${p.stock} unidades` }
                            </span>
                        </div>
                    ))
                }
                
            </div>
        </div>
    )

}