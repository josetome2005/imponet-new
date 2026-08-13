import "./VistaCompra.css"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../../shared/components/layout/Header/Header"
import { Footer } from "../../shared/components/layout/Footer/Footer"
import { formatFecha } from "../../shared/services/dateUtils.js"
import { useState, useEffect } from "react"
import { getVentaByCodigo } from "../../shared/services/ventas.services.js"
import { StatusLabel } from "../../shared/components/ui/StatusLabel/StatusLabel"
import { formatMoneda } from "../../shared/utils/formatMoneda.js"
import { EmptyState } from "../../shared/components/ui/EmptyState/EmptyState.jsx"

const states = [
    { name: "pendiente", value: "pendiente", label: "Pendiente", text: "Recibimos tu pedido y estamos esperando la confirmación del pago.", icon: "nest_clock_farsight_analog" },
    { name: "pagado",    value: "pagado",    label: "Pagado",    text: "El pago fue acreditado. Estamos preparando tu paquete.",            icon: "credit_card" },
    { name: "enviado",   value: "enviado",   label: "Enviado",   text: "Tu pedido salió de nuestro depósito y está en camino.",             icon: "local_shipping" },
    { name: "entregado", value: "entregado", label: "Entregado", text: "El pedido fue entregado. ¡Gracias por tu compra!",                  icon: "hand_package" },
]

export function VistaCompra(){

    const { order_codigo } = useParams()
    const [ compra, setCompra ] = useState(null)
    const navigate = useNavigate()
    const [codigoSearch, setCodigoSearch] = useState("")

    useEffect(() => {
        if(!order_codigo) return;
        async function fetchCompra() {
            const data = await getVentaByCodigo(order_codigo)
            setCompra(data)
        }
        fetchCompra()
    }, [order_codigo])

    const state_index = states.findIndex(s => s.value === compra?.estado)

    const handleSearchOrder = () => {
        if(codigoSearch.trim().length === 0) return;
        navigate(`/order/${codigoSearch}`)
    }


    return(
        <>
            <Header />

            <div className="vista__compra">

                {
                    compra && (
                        <>
                            <div className="vista__compra__header">
                                <div>
                                    <h2>Pedido {order_codigo}</h2>
                                    <p>Realizado el {formatFecha(compra.fecha).fecha_completa}</p>
                                </div>
                                <StatusLabel
                                    text={compra.estado}
                                    status={compra.estado} />
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
                                                        {index < states.length - 1 && (
                                                            <div className="barra_progreso"></div>
                                                        )}

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

                                    <div className="vista__compra__card resumen">
                                        <h3>Resumen</h3>

                                        <div className="resumen__row">
                                            <span className="left">Subtotal</span>
                                            <span className="right">{formatMoneda("ARS").format(compra.total)}</span>
                                        </div>
                                        <div className="resumen__row">
                                            <span className="left">Envío</span>
                                            <span className="right envio_gratis">Gratis</span>
                                        </div>
                                        <div className="resumen__row precio__final__container">
                                            <span className="left">Total</span>
                                            <span className="precio__final">{formatMoneda("ARS").format(compra.total)}</span>
                                        </div>
                                    </div>

                                    <div className="vista__compra__card datos">
                                        <h3>Datos de entrega</h3>
                                        <div className="dato__item">
                                            <span className="material-symbols-outlined">location_on</span>
                                            {compra.nombre}
                                        </div>
                                        <div className="dato__item">
                                            <span className="material-symbols-outlined">mail</span>
                                            {compra.email}
                                        </div>
                                        <div className="dato__item">
                                            <span className="material-symbols-outlined">local_shipping</span>
                                            Envío a {compra.direccion_provincia}, {compra.direccion_ciudad}, {compra.direccion_calle}, {compra.direccion_cp}
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </>
                    )
                }

                {
                    !order_codigo && (
                        <EmptyState 
                            icon={"package_2"}
                            title={"Seguí tu compra"}
                            description={"Ingresá el número de orden que te enviamos por email para ver el estado de tu pedido."}

                            useInput={true}
                            inputValue={codigoSearch}
                            onChange={(e) => setCodigoSearch(e.target.value)}
                            inputPlaceholder={"IMP-******"}

                            buttonIcon={"arrow_forward"}
                            buttonText={"Consultar"}
                            buttonMode={"pink"}
                            disabled={codigoSearch.trim().length === 0}
                            onClick={handleSearchOrder}
                        />
                    )
                }

                {
                    !compra && order_codigo && (
                        <EmptyState 
                            icon={"package_2"}
                            title={"No encontramos ese pedido"}
                            description={"Revisá el número de orden que figura en tu mensaje de confirmación e intentá de nuevo."}

                            buttonIcon={"arrow_forward"}
                            buttonText={"Volver al seguimiento"}
                            buttonMode={"pink"}
                            onClick={() => { setCodigoSearch(""); navigate("/order") }}
                        />
                    )
                }


                
            </div>

            <Footer />
        </>
    )

}