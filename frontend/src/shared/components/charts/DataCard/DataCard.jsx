import "./DataCard.css"

export function DataCard({icon, color, title, info, number}){

    return(

        <div className={`dataCard dataCard--${number}`} >
            <div className="dataCard__icon__container" style={{backgroundColor: color}}>
                <span className="material-symbols-outlined icon">
                    {icon}
                </span>
            </div>
            <div>
                <span className="dataCard__title">{title}</span>
                <span className="dataCard__info">{info}</span>
            </div>
        </div>
    )


}