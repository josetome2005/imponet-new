// Agrupamos ventas por día, sumando el total
const toLocalDateKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}


export function ventasPorDia(ventas, dias = 7){

    const hoy = new Date()
    const buckets = []

    for(let i = dias - 1; i >= 0; i--){
        const fecha = new Date(hoy)
        fecha.setDate(hoy.getDate() - i);

        const key = toLocalDateKey(fecha)
        buckets.push({
            fecha: key,
            fechaLabel: new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(fecha),
            total: 0 
        })
    }

    const bucketMap = new Map(buckets.map(b => [b.fecha, b]))

    ventas.forEach((venta) => {
        if(venta.estado === "cancelado") return;
        const fechaVenta = toLocalDateKey(new Date(venta.fecha))
        const bucket = bucketMap.get(fechaVenta)
        if(bucket) bucket.total += venta.total
    })


    return buckets

} 

// Cuenta ventas por estado, para el gráfico de torta
export function ventasPorEstado(ventas){
    const conteo = {}

    ventas.forEach((venta) => {
        conteo[venta.estado] = (conteo[venta.estado] ?? 0) + 1
    })

    const ESTADO_LABELS = {
        pendiente: "Pendiente",
        pagado: "Pagado",
        enviado: "Enviado",
        entregado: "Entregado",
        cancelado: "Cancelado"
    }

    return Object.entries(conteo).map(([estado, value]) => ({
        name: ESTADO_LABELS[estado] ?? estado,
        value
    }))
}