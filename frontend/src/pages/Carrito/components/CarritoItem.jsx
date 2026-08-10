import "./CarritoItem.css"
import { API_URL } from "../../../shared/services/http.services"
import { formatMoneda } from "../../../shared/utils/formatMoneda"

function getPrecioAMostrar(producto){

    let precio_mostrado = 0
    let precio_original = 0
    let precio_mostrado_valor = 0
    
    
    if(producto.descuento > 0){
        precio_mostrado_valor = parseFloat(producto.precio)*(100 - producto.descuento)/100
        precio_mostrado = formatMoneda("ARS").format(precio_mostrado_valor);
        
        precio_original = formatMoneda("ARS").format(producto.precio);
    }else{
        precio_mostrado_valor = producto.precio
        precio_mostrado = formatMoneda("ARS").format(producto.precio);
    }

    return {
        precio_mostrado,
        precio_original,
        precio_mostrado_valor
    }

}


export function CarritoItem({
    item,
    onChangeAmount, 
    onIncrementAmount,
    onDecrementAmount,
    onDelete
    }){

    const { precio_mostrado, precio_original, precio_mostrado_valor } = getPrecioAMostrar(item)
    const main_img_url = `${API_URL}${item.imagenes[0].url}` 

    return(
        <div className="carrito__item">
            <div className="img__container">
                <img src={main_img_url} alt="" />
            </div>
            <div className="item__data">
                <span className="producto__nombre">{item.nombre}</span>
                <div className="flex--8 y-center">
                    <span className="producto__precio">{precio_mostrado}</span>
                    {precio_original && <span className="producto__ex__precio">{precio_original}</span> }
                </div>
                <div className="manage__amount">
                    <span className="material-symbols-outlined" onClick={() => onDecrementAmount(item.id)}>
                        remove
                    </span>
                    <input 
                        type="number" 
                        onChange={(e) => onChangeAmount(item.id, e)} 
                        value={item.cantidad} 
                    />
                    <span className="material-symbols-outlined" onClick={() => onDecrementAmount(item.id)}>
                        add
                    </span>
                </div>
            </div>

            <span className="material-symbols-outlined delete__icon" onClick={() => onDelete(item.id)}>
                delete
            </span>

            <span className="item__precio">
                {formatMoneda("ARS").format(parseInt(precio_mostrado_valor) * parseInt(item.cantidad))}
            </span>
        </div>
    )    

}   


