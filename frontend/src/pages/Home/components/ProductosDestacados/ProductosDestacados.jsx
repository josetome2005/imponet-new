import "./ProductosDestacados.css"
import { ProductoItem } from "../../../../shared/components/items/ProductoItem/ProductoItem"
import { Button } from "../../../../shared/components/ui/Button/Button"
import { getProductosDestacados } from "../../../../shared/services/productos.services"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ProductoItemSkeleton } from "../../../../shared/components/items/ProductoItem/ProductoItemSkeleton"

export function ProductosDestacados(){

    const [productos, setProductos] = useState([])
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
               
        async function fetchAll() {
            setLoading(true)
            setNotFound(false)
            try{
                const { productos: data } = await getProductosDestacados()
                const productos_seleccionados = data.slice(0, 4)
                setProductos(productos_seleccionados)
            }catch(e){
                console.log(e)
                setNotFound(true)
            }finally{
                setLoading(false)
            }
            
        }
        fetchAll()
    }, [])

    const handleNavigate = (path) => {
        navigate(path)
        window.scrollTo({top: 0})
    }

    if(notFound) return;

    return(

        <div className="productos__section">

            <h3 className="section__title">Productos Destacados</h3>
            <p className="section__subtitle">Los productos más elegidos por nuestros clientes</p>

            <div className="productos__container">
                {loading
                    ?
                    Array.from({ length: 4 }).map((_, i) => (<ProductoItemSkeleton key={i}/>))
                    :
                        productos?.map(p => (
                            <ProductoItem key={p.id} producto={p} />
                        ))
                }
                
            </div>
            
            <div className="button__container">
                <Button 
                    mode={"pink"}
                    text={"Ver más"}
                    onClick={() => handleNavigate("/productos")}
                    disabled={loading}/>
            </div>

        </div>

    )
}