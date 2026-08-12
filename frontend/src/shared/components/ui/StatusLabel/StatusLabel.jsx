import "./StatusLabel.css"

// status = ENUM["cancelado", "pendiente", "pagado", "enviado", "entregado"]

export function StatusLabel({text, status}){

    return(
        <span className={`status__label status__label--${status}`}>
            {text}
        </span>
    )

}