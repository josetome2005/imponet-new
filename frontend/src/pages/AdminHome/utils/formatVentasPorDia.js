export function rellenarVentasPorDia(ventasPorDia, dias = 7) {
    const hoy = new Date()
    const buckets = []

    const toLocalDateKey = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    for (let i = dias - 1; i >= 0; i--) {
        const fecha = new Date(hoy)
        fecha.setDate(hoy.getDate() - i)
        buckets.push({
            fecha: toLocalDateKey(fecha),
            fechaLabel: new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(fecha),
            total: 0
        })
    }

    const bucketMap = new Map(buckets.map(b => [b.fecha, b]))

    ventasPorDia.forEach((row) => {
        // row.dia viene del backend como Date o string "YYYY-MM-DD"
        const key = typeof row.dia === "string" ? row.dia.split("T")[0] : toLocalDateKey(new Date(row.dia))
        const bucket = bucketMap.get(key)
        if (bucket) bucket.total = Number(row.total)
    })

    return buckets
}