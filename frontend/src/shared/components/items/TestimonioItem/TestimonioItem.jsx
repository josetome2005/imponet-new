import "./TestimonioItem.css"

export function TestimonioItem({testimonio}){


    return(

        <div className="testimonio__item">
            <img src="/img/resources/stars.png"/>
            <p className="text">{testimonio.text}</p>
            <div className="flex--8 y-center">
                <div className="initials">
                    {testimonio.author_initials}
                </div>
                <div>
                    <span className="author">{testimonio.author}</span>
                    <span className="location">Compra verificada - {testimonio.location}</span>
                </div>
            </div>
        </div>

    )

}