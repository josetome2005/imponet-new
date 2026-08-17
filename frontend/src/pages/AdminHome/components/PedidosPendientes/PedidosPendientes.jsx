import "./PedidosPendientes.css"
import { formatFecha } from "../../../../shared/services/dateUtils"
import { StatusLabel } from "../../../../shared/components/ui/StatusLabel/StatusLabel"
import { formatMoneda } from "../../../../shared/utils/formatMoneda"
import { Link } from "react-router-dom"
import { Skeleton } from "../../../../shared/components/ui/Skeleton/Skeleton"

function PedidoItemSkeleton({i}){
    return(
        <div className="pedido__item" key={i}>
            <div style={{width: "60%"}}>
                <Skeleton width="40%" height="1rem" style={{display: "block"}} />
                <Skeleton width="70%" height="0.75rem" />
            </div>
            
            <div className="flex--8" style={{ width: "40%" }}>
                <Skeleton width="50%" height="1rem" />
                <Skeleton width="50%" height="1rem" />
            </div>
            
        </div>
    )
}


export function PedidosPendientes({pedidos, isLoading}){

    return(
        <div className="pedidos__pendientes admin__home__section">
            <div className="header__section">
                <div className="flex--16">
                    <span className="material-symbols-outlined icon">
                        schedule
                    </span>
                    <h3>Últimos pedidos pendientes</h3>
                </div>
                <span className="link__to">
                    <Link to={"/admin/ventas"}>Ver todos</Link>
                </span>
            </div>

            <div className="pedidos">
                {isLoading ?
                    (
                        Array.from({ length: 4 }).map((_, i) => (
                            <PedidoItemSkeleton i={i}/>
                        ))
                    ) : (
                        pedidos?.map(v => (
                            <div className="pedido__item">
                                <div>
                                    <span className="pedido__nombre">{v.nombre}</span>
                                    <span className="pedido__sub_data">{v.codigo} - {formatFecha(v.fecha).fecha}</span>
                                </div>
                                <div className="flex--8">
                                    <StatusLabel 
                                        text={v.estado}
                                        status={v.estado}/>
                                    <span className="pedido__total">{formatMoneda("ARS").format(v.total)}</span>
                                </div>
                            </div>
                        ))
                    )
                }
                
            </div>
        </div>
    )

}