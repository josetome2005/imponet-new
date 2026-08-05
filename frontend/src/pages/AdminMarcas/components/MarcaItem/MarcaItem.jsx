import "./MarcaItem.css"

function getInitial(string){
    return String(string)[0]
}

export function MarcaItem({marca}){

    const { nombre, cantidad_productos } = marca

    console.log(marca)

    
    return(
        <div className="marca__item">
            <div className="data__container">
                <div className="flex--12">
                    <span className="marca__initial">{getInitial(nombre)}</span>
                    <div>
                        <span className="marca__nombre">{nombre}</span>
                        <span className="marca__tag">Marca</span>
                    </div>
                </div>
                <div className="actions__container">
                    <span className="material-symbols-outlined edit__icon">
                        edit
                    </span>
                    <span className="material-symbols-outlined delete__icon">
                        delete
                    </span>
                </div>
            </div>

            <div className="productos__tag__container">
                <div className="flex--8 y-center">
                    <span className="material-symbols-outlined icon">
                        sell
                    </span>
                    <div className="productos__tag">Productos</div>
                </div>
                <span className="cantidad__productos">
                    {cantidad_productos}
                </span>
            </div>
            
           
        </div>
    )

}