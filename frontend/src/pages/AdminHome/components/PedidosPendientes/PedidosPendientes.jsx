import { useEffect, useState } from "react"
import "./PedidosPendientes.css"
import { getVentas } from "../../../../shared/services/ventas.services"
import { formatFecha } from "../../../../shared/services/dateUtils"
import { StatusLabel } from "../../../../shared/components/ui/StatusLabel/StatusLabel"
import { formatMoneda } from "../../../../shared/utils/formatMoneda"

export function PedidosPendientes(){

    const [pedidos, setPedidos] = useState([])

    useEffect(() => {
        async function fetchProd(){
            const data = await getVentas()
            const ventas_pendientes = data.filter(v => v.estado === "pendiente")
            setPedidos(ventas_pendientes)
        }
        fetchProd()
    }, [])



    return(
        <div className="pedidos__pendientes admin__home__section">
            <div className="flex--16 header__section">
                <span className="material-symbols-outlined icon">
                    schedule
                </span>
                <h3>Últimos pedidos pendientes</h3>
            </div>

            <div className="pedidos">
                {
                    pedidos.map(v => (
                        <div className="pedido__item">
                            <div>
                                <span className="pedido__nombre">{v.nombre}</span>
                                <span className="pedido__fecha">{formatFecha(v.fecha).fecha}</span>
                            </div>
                            <div className="flex--8">
                                <StatusLabel 
                                    text={v.estado}
                                    status={v.estado}/>
                                <span className="pedido__total">{formatMoneda("ARS").format(v.total)}</span>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        </div>
    )

}