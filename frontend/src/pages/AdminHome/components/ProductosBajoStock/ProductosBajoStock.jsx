import "./ProductosBajoStock.css"
import { Link } from "react-router-dom"
import { Skeleton } from "../../../../shared/components/ui/Skeleton/Skeleton"

function ProductoBajoStockSkeleton(i){
    return(
        <div className="producto__item" key={i}>
            <Skeleton width="40%" height="1.125rem" />
            <Skeleton width="20%" height="1.25rem" />
        </div>
    )
}

export function ProductosBajoStock({productos, isLoading}){

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
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <ProductoBajoStockSkeleton i={i}/>
                    ))
                ) : (
                    productos?.map(p => (
                        <div className="producto__item" key={p.id}>
                            <span className="producto__nombre">{p.nombre}</span>
                            <span className={p.stock === 0 ? "producto__cantidad agotado" : "producto__cantidad"}>
                                {p.stock === 0 ? "Agotado" : `${p.stock} unidades`}
                            </span>
                        </div>
                    ))
                )}
                
            </div>
        </div>
    )

}