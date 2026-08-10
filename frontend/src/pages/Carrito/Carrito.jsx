import "./Carrito.css"
import { Header } from "../../shared/components/layout/Header/Header"
import { Footer } from "../../shared/components/layout/Footer/Footer"
import { Link, useNavigate } from "react-router-dom"
import { useCarrito } from "../../shared/contexts/CarritoContext"
import { API_URL } from "../../shared/services/http.services"
import { formatMoneda } from "../../shared/utils/formatMoneda"
import { useState } from "react"
import { useToast } from "../../shared/components/toast/ToastContext"
import { CarritoItem } from "./components/CarritoItem"
import { Button } from "../../shared/components/ui/Button/Button"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"

export function Carrito(){

    const [showForm, setShowForm] = useState(false)
    const { carrito, cantidadTotal, updateCantidad, removeItem, total } = useCarrito()
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
    
        if(valor >= producto.stock){
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
        updateCantidad(id, Math.minproducto.cantidad - 1)
    }

    const handleIncrement = (id) => {
        const producto = carrito.find(i => i.id === id);
        if(!producto) return;
        updateCantidad(id, producto.cantidad + 1)
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
                        cantidadTotal > 0 &&
                        <>
                            <div className="carrito__productos">
                                {
                                    carrito?.map(i => 
                                            <CarritoItem 
                                                item={i}
                                                onChangeAmount={handleChange}
                                                onIncrementAmount={handleIncrement}
                                                onDecrementAmount={handleDecrement}
                                                onDelete={removeItem}/>    
                                    )
                                }
                            </div>

                            <div className="carrito__resumen">
                                <h3>Resumen de compra</h3>
                                <div className="resumen__row">
                                    <span className="left">Subtotal</span>
                                    <span className="right">{formatMoneda("ARS").format(total)}</span>
                                </div>
                                <div className="resumen__row">
                                    <span className="left">Envío</span>
                                    <span className="right envio_gratis">Gratis</span>
                                </div>
                                <div className="resumen__row precio__final__container"> 
                                    <span className="left">Total</span>
                                    <span className="precio__final">{formatMoneda("ARS").format(total)}</span>
                                </div>
                                <Button 
                                    icon={"lock"}
                                    mode={"pink"}
                                    text={"Finalizar Compra"}
                                    disabled={cantidadTotal === 0}/>
                            </div>
                        </>
                    }

                    {
                        cantidadTotal === 0 &&
                        <div className="carrito__no__productos">
                            <div className="carrito__icon">
                                <span className="material-symbols-outlined">
                                    shopping_cart
                                </span>
                            </div>  
                            <h3>Tu carrito está vacío</h3>
                            <p>Descubrí consolas, drones, audio premium y gadgets seleccionados con los mejores precios.</p>
                        
                            <Button 
                                mode={"pink"}
                                icon={"arrow_right_alt"}
                                iconPosition={"right"}
                                text={"Ver Catálogo"}
                                onClick={() => navigate("/productos")}/>
                        </div>
                    }

                    
                </div>
            </div>

            <Footer />

        </>
    )

}