import "./AdminHome.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { GroupOfStatCards } from "../../shared/components/charts/GroupOfStatCards/GroupOfStatCards"
import { buildStatCards } from "./utils/buildStatCards"
import { ProductosBajoStock } from "./components/ProductosBajoStock/ProductosBajoStock"
import { PedidosPendientes } from "./components/PedidosPendientes/PedidosPendientes"
import { MyBarChart } from "../../shared/components/charts/MyBarChart/MyBarChart"
import { MyPieChart } from "../../shared/components/charts/MyPieChart/MyPieChart"
import { useDashboardData } from "./hooks/useDashboardData"
import { rellenarVentasPorDia } from "./utils/formatVentasPorDia"
import { formatVentasPorEstado } from "./utils/formatVentaPorEstado"
import { SkeletonGroupOfStatCards } from "../../shared/components/charts/GroupOfStatCards/SkeletonStatCard"

const ESTADO_COLORS = ["#f5b942", "#4ea1f5", "#a874f0", "#3ecf8e", "#f56565"]
// pendiente, pagado, enviado, entregado, cancelado — mismo orden/paleta que usamos en los badges


export function AdminHome(){

    const { resumen, loading } = useDashboardData()

    const statCards = resumen ? buildStatCards(resumen) : []
    const dataVentasPorDia = resumen ? rellenarVentasPorDia(resumen.ventasPorDia, 7) : []
    const dataVentasPorEstado = resumen ? formatVentasPorEstado(resumen.ventasPorEstado) : []

    return(

        <section className="admin__section admin__home">
            <SectionTitle 
                title={"Dashboard"}
                subtitle={"Resumen de tu catálogo de Imponet."}/>
            {
                loading ? (
                    <SkeletonGroupOfStatCards />
                ) : (
                    <GroupOfStatCards 
                        statCards={statCards}
                    />
                )
            }
            

            <div className="charts__container">
                <ProductosBajoStock 
                    productos={resumen?.stockBajo}
                />
                <PedidosPendientes 
                    pedidos={resumen?.pedidosPendientes}
                />
            </div>

            <div className="charts__container">
                <div className="admin__home__section">
                    <MyBarChart
                        data={dataVentasPorDia}
                        title={"Ventas últimos 7 días"}
                        xAxisTitle={"fechaLabel"}
                        yAxisTitle={"total"} />
                </div>
                <div className="admin__home__section">
                    <MyPieChart
                        data={dataVentasPorEstado}
                        colors={ESTADO_COLORS}
                        title="Ventas por estado"
                    />
                </div>
                
                
            </div>




        </section>
    )

}