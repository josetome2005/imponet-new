import "./Carrito.css"
import { Header } from "../../shared/components/layout/Header/Header"
import { Footer } from "../../shared/components/layout/Footer/Footer"
import { Link, useNavigate } from "react-router-dom"
import { useCarrito } from "../../shared/contexts/CarritoContext"
import { formatMoneda } from "../../shared/utils/formatMoneda"
import { useState } from "react"
import { useToast } from "../../shared/components/toast/ToastContext"
import { CarritoItem } from "./components/CarritoItem/CarritoItem"
import { Button } from "../../shared/components/ui/Button/Button"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"
import { crearVenta } from "../../shared/services/ventas.services.js"
import { Skeleton } from "../../shared/components/ui/Skeleton/Skeleton.jsx"
import { CarritoItemSkeleton } from "./components/CarritoItemSkeleton/CarritoItemSkeleton.jsx"

const inputs = [
    {
        title: "Datos Personales",
        inputs: [
            { name: "input_nombre", type: "text", label: "Nombre Completo", mappedProp: "nombre", is_mandatory: true, width: "50" },
            { name: "input_email", type: "email", label: "Email", mappedProp: "email", is_mandatory: true, width: "50" },
            { name: "input_telefono", type: "phone", label: "Teléfono", mappedProp: "telefono", is_mandatory: true, width: "50" },
        ]
    },
    {
        title: "Dirección",
        inputs: [
            { name: "input_provincia", type: "text", label: "Provincia", mappedProp: "direccion_provincia", is_mandatory: true, width: "50" },
            { name: "input_ciudad", type: "text", label: "Ciudad", mappedProp: "direccion_ciudad", is_mandatory: true, width: "50" },
            { name: "input_calle", type: "text", label: "Calle y Numeración", mappedProp: "direccion_calle", is_mandatory: true, width: "50" },
            { name: "input_cp", type: "text", label: "Código Postal", mappedProp: "direccion_cp", is_mandatory: true, width: "50" },
        ]
    }
]

export function Carrito(){

    const [showForm, setShowForm] = useState(false)
    const [loadingVenta, setLoadingVenta] = useState(false)
    const { 
        carrito, 
        cantidadTotal, 
        updateCantidad, 
        removeItem, 
        total, 
        clearCarrito, 
        itemsRaw,
        loading 
    } = useCarrito()
    const toast = useToast()
    const navigate = useNavigate()

    const handleChange = (id, e) => {
        const { value } = e.target
        const valor = parseInt(value)
        const producto = carrito.find(i => i.id === id);
        if(!producto) return;
   
        if(isNaN(valor)){
            updateCantidad(id, 1)
            return
        }
    
        if(valor > producto.stock){
            updateCantidad(id, producto.stock)
            toast.info(`La cantidad de productos no puede superar el stock: ${producto.stock}`)
        }else if(valor <= 0){
            updateCantidad(id, 1)
        }else{
            updateCantidad(id, valor)
        }
    }
    
    const handleDecrement = (id) => {
        const producto = carrito.find(i => i.id === id);
        if(!producto) return;
        updateCantidad(id, Math.max(producto.cantidad - 1, 1))
    }

    const handleIncrement = (id) => {
        const producto = carrito.find(i => i.id === id);
        if(!producto) return;

        if (producto.cantidad >= producto.stock) {
            toast.info(`La cantidad máxima disponible es ${producto.stock} unidades.`)
            return
        }

        updateCantidad(id, Math.min(producto.cantidad + 1, producto.stock), 1)
    }

    /*----------------------------------------------------------------------------------*/

    const WHATSAPP_NUMBER = "5493513747022"
    const SITE_URL = "http://localhost:5173"

    const buildWhatsappMessage = (venta) => {
        const lineas = venta.detalle.map((item) =>
            `• ${item.cantidad}x ${item.producto_nombre} — ${formatMoneda("ARS").format(item.subtotal)}`
        ).join("\n")

        const linkSeguimiento = `${SITE_URL}/order/${venta.codigo}`

        return (
            `¡Hola! Quiero confirmar mi pedido *${venta.codigo}*\n\n` +
            `*Productos:*\n${lineas}\n\n` +
            `*Total: ${formatMoneda("ARS").format(venta.total)}*\n\n` +
            `*Datos de envío:*\n` +
            `${venta.nombre}\n` +
            `${venta.direccion_calle}, ${venta.direccion_ciudad}, ${venta.direccion_provincia} (CP ${venta.direccion_cp})\n` +
            `Tel: ${venta.telefono}\n` +
            `Email: ${venta.email}\n\n` +
            `🔗 Seguimiento de mi pedido:\n${linkSeguimiento}\n\n` +
            `Quedo atento/a para coordinar el pago y la entrega. ¡Gracias!`
        )
    }
   
    const handleSubmitData = async (formData) => {

        const { nombre, email, telefono, direccion_provincia, direccion_ciudad, direccion_calle, direccion_cp } = formData

        const items = carrito.map((p) => ({
            producto_id: p.id,
            cantidad: p.cantidad
        }))
        setLoadingVenta(true)
        try{
            const new_venta = await crearVenta({
                nombre,
                email,
                telefono,
                direccion_provincia,
                direccion_ciudad,
                direccion_calle,
                direccion_cp,
                items
            })
            toast.success("Se ha registrado su compra correctamente")

            const mensaje = buildWhatsappMessage(new_venta)
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
            window.open(whatsappUrl, "_blank")

            clearCarrito()
            setShowForm(false)
            navigate(`/order/${new_venta.codigo}`)
        }catch(e){
            console.log(e)
            toast.error(e.message ?? "Ha ocurrido un error al registrar su compra.")
        }finally{
            setLoadingVenta(false)
        }

        
    }

    return(
        <>
            <Header />

            <div className="carrito">

                <div className="carrito__header">
                    <Link to={""} className="link">Inicio</Link>
                    <span className="slash"> / </span>
                    <Link to={`/cart`} className="link active_link">Carrito</Link>
                </div>

                <h3 className="carrito__title">Tu carrito</h3>
                <span className="carrito__subtitle">
                    {cantidadTotal} producto{cantidadTotal > 1 || cantidadTotal === 0 ? "s" : ""} listo{cantidadTotal > 1 || cantidadTotal === 0 ? "s" : ""} para comprar</span>
            
                <div className="flex--24 carrito__container">

                    {
                        itemsRaw.length > 0 &&
                        <>
                            <div className="carrito__productos">
                                { loading 
                                    ?
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <CarritoItemSkeleton />
                                        ))
                                    :
                                        carrito?.map(i => 
                                                <CarritoItem 
                                                    item={i}
                                                    onChangeAmount={handleChange}
                                                    onIncrementAmount={handleIncrement}
                                                    onDecrementAmount={handleDecrement}
                                                    onDelete={removeItem}/>    
                                        )
                                }

                                <div className="bottom__carrito">
                                    <div>
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        <Link to={"/productos"}>Seguir comprando</Link>
                                    </div>
                                    <div>
                                        <span className="vaciar__carrito" onClick={() => clearCarrito()}>Vaciar Carrito</span>
                                    </div>
                                </div>
                            </div>

                            <div className="carrito__resumen">
                                <h3>Resumen de compra</h3>
                                <div className="resumen__row">
                                    <span className="left">Subtotal</span>
                                    <span className="right">
                                        {loading 
                                            ? <Skeleton width="100px" height="1rem" />
                                            : formatMoneda("ARS").format(total)
                                        }</span>
                                </div>
                                <div className="resumen__row">
                                    <span className="left">Envío</span>
                                    <span className="right envio_gratis">Gratis</span>
                                </div>
                                <div className="resumen__row precio__final__container"> 
                                    <span className="left">Total</span>
                                    <span className="precio__final">{
                                        loading
                                            ? <Skeleton width="150px" height="1.5rem" />
                                            : formatMoneda("ARS").format(total)
                                        }
                                    </span>
                                </div>
                                <Button 
                                    icon={"lock"}
                                    mode={"pink"}
                                    text={"Finalizar Compra"}
                                    disabled={loading || cantidadTotal === 0}
                                    onClick={() => setShowForm(true)}/>
                            </div>
                        </>
                    }

                    {
                        itemsRaw.length === 0 &&
                        <div className="carrito__no__productos">
                            <div className="carrito__icon">
                                <span className="material-symbols-outlined">
                                    shopping_cart
                                </span>
                            </div>  
                            <h3>Tu carrito está vacío</h3>
                            <p>Descubrí consolas, drones, audio premium y gadgets seleccionados con los mejores precios.</p>
                        
                            <Button 
                                icon={"arrow_right_alt"}
                                iconPosition={"right"}
                                text={"Ver Catálogo"}
                                onClick={() => navigate("/productos")}/>
                        </div>
                    }

                    
                </div>


                {
                    showForm &&
                    <NewElemForm 
                        title={"Datos necesarios para tu compra"}
                        handleExit={() => setShowForm(false)}
                        handleSubmit={handleSubmitData}
                        sections={inputs}
                        isSubmitting={loadingVenta}
                        />
                }
            </div>

            <Footer />

        </>
    )

}