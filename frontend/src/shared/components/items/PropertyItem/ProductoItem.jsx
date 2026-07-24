import "./ProductoItem.css"

function parsePrice(price){

    return price.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    })
}

export function ProductoItem({producto}){

    const precio = parsePrice(producto.precio)

    const precio_con_descuento_numero = parseFloat(producto.precio) * (100 - producto.descuento) / 100
    const precio_con_descuento = parsePrice(precio_con_descuento_numero)

    return(

        <div className="property__item">

            <div className="img__container">
                <img  src={producto.img} alt={producto.name}/>
            </div>  

            <span className="producto__categoria">{producto.categoria}</span>
            <span className="producto__name">{producto.name}</span>

            {
                producto.descuento && producto.descuento > 0
                    ? ( 
                        <div>
                            <span className="producto__descuento">
                                {precio}
                            </span>
                            <span className="producto__precio">
                                {precio_con_descuento}
                            </span>
                        </div>
                    )
                    : (
                        <span className="producto__precio">
                            {precio}
                        </span>
                    )
            }


        </div>

    )

}