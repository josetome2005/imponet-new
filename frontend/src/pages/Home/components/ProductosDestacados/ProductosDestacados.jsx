import "./ProductosDestacados.css"
import { ProductoItem } from "../../../../shared/components/items/PropertyItem/ProductoItem"
import { Button } from "../../../../shared/components/ui/Button/Button"

const productos = [
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto1.png",
        categoria: "Audio",
        name: "Auriculares Inalámbricos Sony Wh-1000xm4",
        precio: 149999,
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto2.png",
        categoria: "Entretenimiento",
        name: "DJI Mavic 4 Pro 100MP 4/3 CMOS Hasselblad",
        precio: 449999
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto3.png",
        categoria: "Audio",
        name: "Jbl Charge 6 Parlante Bluetooth 2026",
        precio: 249999
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto4.png",
        categoria: "Relojes",
        name: "Smartwatch Xiaomi Redmi Watch 5 Active",
        precio: 129999
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto1.png",
        categoria: "Audio",
        name: "Auriculares Inalámbricos Sony Wh-1000xm4",
        precio: 149999
    },
]

export function ProductosDestacados(){

    return(

        <div className="productos__destacadas">

            <h3 className="section__title">Ofertas de tiempo limitado</h3>
            <p className="section__subtitle">Aprovecha los mejores descuentos en nuestros productos.</p>

            <div className="productos__container">
                {
                    productos?.map(p => (
                        <ProductoItem producto={p} />
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