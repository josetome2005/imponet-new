import { formatMoneda } from "../../../shared/utils/formatMoneda"
import { formatFecha } from "../../../shared/services/dateUtils"
import { StatusLabel } from "../../../shared/components/ui/StatusLabel/StatusLabel"

export const searchFields = [
    "nombre",
    "codigo"
]

export const tabs = [
    { key: "todos", label: "Todos", filterFn: () => true },
    { key: "pendiente", label: "Pendiente", filterFn: (v) => v.estado === "pendiente" },
    { key: "enviado", label: "Enviado", filterFn: (v) => v.estado === "enviado" },
    { key: "entregado", label: "Entregado", filterFn: (v) => v.estado === "entregado" },
    { key: "pagado", label: "Pagado", filterFn: (v) => v.estado === "pagado" },
    { key: "cancelado", label: "Cancelado", filterFn: (v) => v.estado === "cancelado" },
]

const opciones_estado = [
    { id: "pendiente", label: "Pendiente", value: "pendiente" },
    { id: "pagado", label: "Pagado", value: "pagado" },
    { id: "enviado", label: "Enviado", value: "enviado" },
    { id: "entregado", label: "Entregado", value: "entregado" },

]

export const inputs = [
    { id: "venta__estado", label: "Estado de Venta", type: "select", mappedProp: "estado", is_mandatory: true, options: opciones_estado }
]

const getCantidadArticulos = (venta) => {
    const { detalle } = venta
    return detalle.reduce((acc, i) => acc + i.cantidad, 0)
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
                <span className="venta__fecha">{formatFecha(v.fecha).fecha}</span>
                <span className="venta__hora">{formatFecha(v.fecha).hora}</span>
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
            <StatusLabel 
                text={v.estado}
                status={v.estado}/>

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
