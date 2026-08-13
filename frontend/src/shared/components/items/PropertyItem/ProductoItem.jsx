import "./ProductoItem.css"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../../services/http.services"

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

    const navigate = useNavigate()

    const main_img = producto.imagenes[0]
    

    return(

        <div className="producto__item" onClick={() => navigate(`/producto/${producto.id}`)}>

            <div className="img__container">
                <img src={`${API_URL}${main_img.url}`} alt={producto.nombre}/>
            </div>  

            <span className="producto__categoria">{producto.categoria}</span>
            <span className="producto__name">{producto.nombre}</span>

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