import "./Ofertas.css"
import { ProductoItem } from "../../../../shared/components/items/PropertyItem/ProductoItem"
import { Button } from "../../../../shared/components/ui/Button/Button"

const productos = [
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto1.png",
        categoria: "Audio",
        name: "Auriculares Inalámbricos Sony Wh-1000xm4",
        precio: 149999,
        descuento: 10
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto2.png",
        categoria: "Entretenimiento",
        name: "DJI Mavic 4 Pro 100MP 4/3 CMOS Hasselblad",
        precio: 449999,
        descuento: 15
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto3.png",
        categoria: "Audio",
        name: "Jbl Charge 6 Parlante Bluetooth 2026",
        precio: 249999,
        descuento: 20
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto4.png",
        categoria: "Relojes",
        name: "Smartwatch Xiaomi Redmi Watch 5 Active",
        precio: 129999,
        descuento: 30
    },
    {
        id: crypto.randomUUID(),
        img: "/img/productos/producto1.png",
        categoria: "Audio",
        name: "Auriculares Inalámbricos Sony Wh-1000xm4",
        precio: 149999,
        descuento: 12
    },
]

export function Ofertas(){

    return(

        <div className="productos__destacadas">

            <h3 className="section__title">Productos Destacados</h3>
            <p className="section__subtitle">Los productos más elegidos por nuestros clientes</p>

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