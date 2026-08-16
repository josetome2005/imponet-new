import "./CategoriaItem.css"

export function CategoriaItem({categoria}){



    return(

        <div className="categoria__item">
            
            <div className="img__container">
                <img src={categoria.img} alt={categoria.name} />
            </div>
            <span className="categoria__name">{categoria.name}</span>
            <span className="categoria__cta">Explorar</span>
        </div>

    )

}