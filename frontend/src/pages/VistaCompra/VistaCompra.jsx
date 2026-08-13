import "./VistaCompra.css"
import { useParams } from "react-router-dom"
import { Header } from "../../shared/components/layout/Header/Header"
import { Footer } from "../../shared/components/layout/Footer/Footer"
import { formatFecha } from "../../shared/services/dateUtils.js"
import { useState, useEffect } from "react"
import { getVentaByCodigo } from "../../shared/services/ventas.services.js"
import { StatusLabel } from "../../shared/components/ui/StatusLabel/StatusLabel"
import { formatMoneda } from "../../shared/utils/formatMoneda.js"

const states = [
    { name: "pendiente", value: "pendiente", label: "Pendiente", text: "Recibimos tu pedido y estamos esperando la confirmación del pago.", icon: "nest_clock_farsight_analog" },
    { name: "pagado",    value: "pagado",    label: "Pagado",    text: "El pago fue acreditado. Estamos preparando tu paquete.",            icon: "credit_card" },
    { name: "enviado",   value: "enviado",   label: "Enviado",   text: "Tu pedido salió de nuestro depósito y está en camino.",             icon: "local_shipping" },
    { name: "entregado", value: "entregado", label: "Entregado", text: "El pedido fue entregado. ¡Gracias por tu compra!",                  icon: "hand_package" },
]

export function VistaCompra(){

    const { order_codigo } = useParams()
    const [ compra, setCompra ] = useState(null)

    useEffect(() => {
        async function fetchCompra() {
            const data = await getVentaByCodigo(order_codigo)
            console.log(data)
            setCompra(data)
        }
        fetchCompra()
    }, [])

    if(!compra) return;

    const state_index = states.findIndex(s => s.value === compra.estado)


    return(
        <>
            <Header />

            <div className="vista__compra">
                <div className="vista__compra__header">
                    <div>
                        <h2>Pedido {order_codigo}</h2>
                        <p>Realizado el {formatFecha(compra.fecha).fecha_completa}</p>
                    </div>
                    <StatusLabel
                        text={compra.estado}
                        status={compra.estado}/>
                </div>  

                <div className="vista__compra__data__container">
                    
                    <div className="left_row">

                        <div className="vista__compra__card states__container">
                            
                            <h3>Estado de tu compra</h3>
                            {
                                states?.map((s, index) => (
                                    <div className={`state__item ${index == state_index ? "activo" : index < state_index ? "pasado" : ""}`}>
                                        <div className="flex--4 x-center icon__container">
                                            <span className="material-symbols-outlined icon">
                                                {s.icon}
                                            </span>
                                            { index < states.length - 1 && (
                                                <div className="barra_progreso"></div>
                                            ) }
                                            
                                        </div>
                                        
                                        <div>
                                            <span className="state__label">{s.label}</span>
                                            <p className="state__text">{s.text}</p>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>

                        <div className="vista__compra__card productos">
                            <h3>Productos</h3>
                            {
                                compra?.detalle.map(p => (
                                    <div className="vista__compra__producto">
                                        <div>
                                            <span className="nombre">{p.producto_nombre}</span>
                                            <p className="cantidad">{`${p.cantidad} x ${formatMoneda("ARS").format(p.precio_unitario)}`}</p>
                                        </div>
                                        <span className="subtotal">{formatMoneda("ARS").format(p.subtotal)}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="right_row">
                        <div className="vista__compra__card">
                            <h3>Resumen</h3>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    )

}