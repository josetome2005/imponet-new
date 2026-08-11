import { parseLocalDate } from "../../../shared/services/dateUtils"
import { formatMoneda } from "../../../shared/utils/formatMoneda"

export const searchFields = [
    "nombre",
    "codigo"
]

export const tabs = [

]

const getCantidadArticulos = (venta) => {
    const { detalle } = venta
    return detalle.reduce((acc, i) => acc + i.cantidad, 0)
}

export function formatFechaVenta(fechaISO) {
    if (!fechaISO) return ""

    const date = new Date(fechaISO)

    const fecha_completa = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date)

    const fecha = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date)

    const hora = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date)

    return {
        fecha_completa, 
        fecha, 
        hora
    }
}



export const ventas_columns = (onEdit, onCancel, onSee) => [
    {
        key: "nombre",
        name: "PEDIDO",
        render: (v) => (
            <div>
                <span className="venta__codigo">{v.codigo}</span>
                <span className="venta__cantidad">{getCantidadArticulos(v)} articulo(s)</span>
            </div>
        )
    },
    {
        key: "cliente",
        name: "CLIENTE",
        render: (v) => (
            <div>
                <span className="venta__cliente">{v.nombre}</span>
                <span className="venta__email">{v.email}</span>
            </div>
        )
    },
    {
        key: "fecha",
        name: "FECHA",
        render: (v) => (
            <div>
                <span className="venta__fecha">{formatFechaVenta(v.fecha).fecha}</span>
                <span className="venta__hora">{formatFechaVenta(v.fecha).hora}</span>
            </div>
        )
    },
    {
        key: "total",
        name: "TOTAL",
        render: (v) => (
            <span className="venta__total">{formatMoneda("ARS").format(v.total)}</span>

        )
    },
    {
        key: "state",
        name: "ESTADO",
        render: (v) => (
            <span className={`venta__estado venta__estado--${v.estado}`}>{v.estado}</span>

        )
    },
    {
        key: "actions",
        name: "",
        render: (v) => (
            <div className="flex--16 y-center actions__container">
                {
                    v.estado !== "cancelado" &&
                    <>
                        <span className="material-symbols-outlined icon edit__icon" onClick={() => onEdit(v)} title="Editar">
                            edit
                        </span>
                            <span className="material-symbols-outlined icon cancel__icon" onClick={() => onCancel(v)} title="Cancelar">
                            cancel
                        </span>
                    </>
                }
                <span className="material-symbols-outlined icon see__icon" onClick={() => onSee(v)} title="Ver Detalle">
                    visibility
                </span>
            </div>
        )
    },

]
