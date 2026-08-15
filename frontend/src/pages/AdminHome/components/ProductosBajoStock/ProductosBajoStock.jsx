import "./ProductosBajoStock.css"
import { Link } from "react-router-dom"

export function ProductosBajoStock({productos}){

    return(
        <div className="productos__bajo__stock admin__home__section">
            <div className="header__section">
                <div className="flex--16">
                    <span className="material-symbols-outlined icon">
                        warning
                    </span>
                    <h3>Productos con poco stock</h3>
                </div>
                <span className="link__to">
                    <Link to={"/admin/productos"}>Ver todos</Link>
                </span>
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