import "./ProductosDestacados.css"
import { ProductoItem } from "../../../../shared/components/items/PropertyItem/ProductoItem"
import { Button } from "../../../../shared/components/ui/Button/Button"
import { getProductosDestacados } from "../../../../shared/services/productos.services"
import { useState, useEffect } from "react"

export function ProductosDestacados(){

    const [productos, setProductos] = useState([])

    useEffect(() => {
        async function fetchAll() {
            const { productos: data } = await getProductosDestacados()
            setProductos(data)
        }
        fetchAll()
    }, [])

    return(

        <div className="productos__section">

            <h3 className="section__title">Productos Destacados</h3>
            <p className="section__subtitle">Los productos más elegidos por nuestros clientes</p>

            <div className="productos__container">
                {
                    productos?.map(p => (
                        <ProductoItem key={p.id} producto={p} />
                    ))
                }
                
            </div>
            
            <div className="button__container">
                <Button 
                    mode={"pink"}
                    text={"Ver más"}/>
            </div>

        </div>

    )
}