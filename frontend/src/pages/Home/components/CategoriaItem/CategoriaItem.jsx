import "./CategoriaItem.css"

export function CategoriaItem({categoria}){



    return(

        <div className="categoria__item">
            
            <img src={categoria.img} alt={categoria.name} />
            <span className="categoria__meta_categoria">{categoria.meta_categoria}</span>
            <span className="categoria__name">{categoria.name}</span>
        </div>

    )

}