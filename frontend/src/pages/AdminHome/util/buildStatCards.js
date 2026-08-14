import { getVentas } from "../../../shared/services/ventas.services"
import { isWithinLast30Days } from "../../../shared/services/dateUtils"
import { formatMoneda } from "../../../shared/utils/formatMoneda"
import { getProductos } from "../../../shared/services/productos.services"
import { getCategorias } from "../../../shared/services/categorias.services"
import { getMarcas } from "../../../shared/services/marcas.services"

export async function buildStatCards(){

    const ventas = await getVentas()

    const ventas_ultimo_mes = ventas.filter(v => isWithinLast30Days(v?.fecha.toString()))
    const monto_venta_ultimo_mes = ventas_ultimo_mes.reduce((acc, v) => {
        return acc + v.total
    }, 0)

    const ventas_pendientes = ventas.filter(v => v.estado === "pendiente")

    /*----------------------------------------------------*/

    const productos = await getProductos()
    const marcas = await getMarcas();
    const categorias = await getCategorias();

    const valor_inventario = productos.reduce((acc, p) => {
        return acc + p.stock * p.precio
    }, 0)
 
    return(
        [
            {
                id: crypto.randomUUID(),
                title: "Ventas último mes",
                stat: formatMoneda("ARS").format(monto_venta_ultimo_mes),
                description: `${ventas_ultimo_mes.length} pedidos`,
                icon: "trending_up",
            },
            {
                id: crypto.randomUUID(),
                title: "Pedidos pendientes",
                stat: ventas_pendientes.length,
                description: "Por procesar",
                icon: "schedule",
            },
            {
                id: crypto.randomUUID(),
                title: "Productos Activos",
                stat: productos.length,
                description: `${marcas.length} marcas · ${categorias.length} cat.`,
                icon: "package_2",
            },
            {
                id: crypto.randomUUID(),
                title: "Valor inventario",
                stat: formatMoneda("ARS").format(valor_inventario),
                description: "De tu stock",
                icon: "stacks",
            }
        ]
    )

}