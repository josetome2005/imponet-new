const ESTADO_LABELS = {
    pendiente: "Pendiente",
    pagado: "Pagado",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado"
}

export function formatVentasPorEstado(ventasPorEstado) {
    return ventasPorEstado.map((row) => ({
        name: ESTADO_LABELS[row.estado] ?? row.estado,
        value: Number(row.cantidad)
    }))
}