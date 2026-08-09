import "./ProductoView.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductoSlider from "./components/ProductoSlider/ProductoSlider"
import { getProductoById } from "../../shared/services/productos.services";
import { Header } from "../../shared/components/layout/Header/Header";
import { Footer } from "../../shared/components/layout/Footer/Footer";

const formatMoneda = () => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    });
}


export function ProductoView() {

    const { producto_id } = useParams();
    const [producto, setProducto] = useState()

    useEffect(() => {
        async function fetchProd(){
            const data = await getProductoById(producto_id);
            setProducto(data) 
        }
        fetchProd()        
    }, [producto_id])
    
    
    if(!producto) return;
    
    let precio = formatMoneda("ARS").format(producto.precio)

    return(

        <>

            <Header />

            <div className="producto_view">

                <div className="producto_view__header">
                    <Link to={""} className="link">Inicio</Link>
                    <span className="slash"> / </span>
                    <Link to={`/productos`} className="link">Productos</Link>
                    <span className="slash"> / </span>
                    <span className="producto_title">{producto.nombre}</span>
                </div>

                <div className="producto_view__content">

                    <div className="producto_main_content">
                        <ProductoSlider images={producto.imagenes}/>

                        {<div className="producto_info">
                            <p className="producto_title">{producto.nombre}</p>
                            <span className="producto_price">{precio}</span>

                            
                            <a className="producto_button">Agregar al Carrito</a>
                        </div>}
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
            
            <Footer />
        </>

    )


}