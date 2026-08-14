import "./StatCard.css"

export function StatCard({title, icon, stat, description }){


    return(

        <div className="statCard">

            <span className="material-symbols-outlined icon">
                {icon}
            </span>

            <span className="statCard__title">{title}</span>
            <span className="statCard__stat">{stat}</span>
            <span className="statCard__description">{description}</span>

        </div>

    )

}