import "./ProductoView.css"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductoSlider from "./components/ProductoSlider/ProductoSlider"
import { getProductoById } from "../../shared/services/productos.services";
import { Header } from "../../shared/components/layout/Header/Header";
import { Footer } from "../../shared/components/layout/Footer/Footer";
import { Button } from "../../shared/components/ui/Button/Button";
import { useToast } from "../../shared/components/toast/ToastContext"
import { useCarrito } from "../../shared/contexts/CarritoContext";
import { formatMoneda } from "../../shared/utils/formatMoneda"
import { ProductoViewSkeleton } from "./components/ProductoViewSkeleton/ProductoViewSkeleton";

export function ProductoView() {

    const { producto_id } = useParams();
    const [producto, setProducto] = useState(undefined)
    const [notFound, setNotFound] = useState(false)
    const [amount, setAmount] = useState(1)

    const navigate = useNavigate()
    const toast = useToast()
    const carrito = useCarrito()

    useEffect(() => {
        async function fetchProd(){
            setNotFound(false)
            try {
                const data = await getProductoById(producto_id);
                setProducto(data)
            } catch (e) {
                setNotFound(true)
            }
        }
        fetchProd()      
    }, [producto_id])   
    
    /*--------------------------------------------------------------------------*/

    if(notFound) return (
        <>
            <div className="producto__no__page">
                <div>
                    <span>404</span>
                    <h3>Producto no encontrado</h3>
                    <p>El producto que buscás no existe o fue eliminado.</p>
                    <Button 
                        text={"Volver al inicio"}
                        onClick={() => navigate("/")}/>
                </div>
            </div>
        </>
    );

    /*--------------------------------------------------------------------------*/
    
    let precio_mostrado = 0
    let precio_original = 0
    
    if(producto?.descuento > 0){
        let precio_con_descuento = parseFloat(producto?.precio)*(100 - producto?.descuento)/100
        precio_mostrado = formatMoneda("ARS").format(precio_con_descuento);
        
        precio_original = formatMoneda("ARS").format(producto?.precio);
    }else{
        precio_mostrado = formatMoneda("ARS").format(producto?.precio);
    }

    /*--------------------------------------------------------------------------*/


    const handleChange = (e) => {
        const { value } = e.target
    
        const valor = parseInt(value)
    
        if(isNaN(valor)){
            setAmount(1)
            return
        }
    
        if(valor >= producto?.stock){
            setAmount(producto?.stock)
            toast.info(`La cantidad de productos no puede superar el stock: ${producto.stock}`)
        }else if(valor <= 0){
            setAmount(1)
        }else{
            setAmount(valor)
        }
    }
    
    const handleDecrement = () => {
        setAmount(prev => Math.max(1, prev - 1))
    }
    
    const handleIncrement = () => {
        setAmount(prev => Math.min(producto?.stock, prev + 1))
    }

    const handleAgregarAlCarrito = () => {
        carrito.addItem(producto?.id, amount)
        toast.success("Se ha agregado al carrito exitosamente.")
    }

    return(

        <>

            <Header />
            
            {
                producto ?
                    <div className="producto_view">

                        <div className="producto_view__header">
                            <Link to={""} className="link">Inicio</Link>
                            <span className="slash"> / </span>
                            <Link to={`/productos`} className="link">Productos</Link>
                            <span className="slash"> / </span>
                            <span className="producto_title">{producto?.nombre}</span>
                        </div>

                        <div className="producto_view__content">

                            <div className="producto_main_content">
                                <ProductoSlider images={producto?.imagenes}/>

                                {
                                    <div className="producto_info">
                                        <span className="producto_marca">{producto?.marca_nombre}</span>
                                        <p className="producto_nombre">{producto?.nombre}</p>
                                        <div className="categorias__container">
                                            {
                                                producto?.categorias?.map(c => (
                                                    <span key={c.nombre} className="producto_categoria">
                                                        {c.nombre}
                                                    </span>     
                                                ))
                                            }
                                        </div>
                                        <div className="precio_container">
                                            <span className="producto_precio">{precio_mostrado}</span>
                                            {   
                                                precio_original > 0 && 
                                                <span className="producto_ex_precio">{precio_original}</span>
                                            }
                                        </div>
                                        <p className="producto_stock">Stock Disponible: {producto?.stock}</p>
                                        
                                        <div className="producto_button_shopping">
                                            <div className="manage__amount">
                                                <span className="material-symbols-outlined" onClick={handleDecrement}>
                                                    remove
                                                </span>
                                                <input type="number" onChange={handleChange} value={amount} />
                                                <span className="material-symbols-outlined" onClick={handleIncrement}>
                                                    add
                                                </span>
                                            </div>
                                            <Button 
                                                mode={"pink"}
                                                text={"Agregar al carrito"}
                                                iconPosition={"right"}
                                                icon={"shopping_cart"}
                                                onClick={handleAgregarAlCarrito}/>                            
                                            </div>
                                        </div>
                                }
                            </div>
                            
                            {
                                producto.descripcion &&
                                <section className="producto_section">
                                    <span className="producto_section_title">Descripción</span>
                                    <p className="producto_description">{producto.descripcion}</p>
                                </section>
                            }
                            
                                            
                        </div>


                    </div>
                    
                    : <ProductoViewSkeleton />
            }
                        
            <Footer />
        </>

    )


}