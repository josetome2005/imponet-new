import { formatMoneda } from "../../../shared/utils/formatMoneda"

export function buildStatCards(resumen){

    const { ventasMes, pedidosPendientesCount, productos } = resumen

    return(
        [
            {
                id: crypto.randomUUID(),
                title: "Ventas último mes",
                stat: formatMoneda("ARS").format(ventasMes.monto),
                description: `${ventasMes.cantidad} pedidos`,
                icon: "trending_up",
            },
            {
                id: crypto.randomUUID(),
                title: "Pedidos pendientes",
                stat: pedidosPendientesCount,
                description: "Por procesar",
                icon: "schedule",
            },
            {
                id: crypto.randomUUID(),
                title: "Productos Activos",
                stat: productos.activos,
                description: `${productos.cantidadMarcas} marcas · ${productos.cantidadCategorias} cat.`,
                icon: "package_2",
            },
            {
                id: crypto.randomUUID(),
                title: "Valor inventario",
                stat: formatMoneda("ARS").format(productos.valorInventario),
                description: "De tu stock",
                icon: "stacks",
            }
        ]
    )

}