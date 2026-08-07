import "./Button.css"

export function Button({mode = "default", text, icon, iconPosition="left", onClick}){


    return(

        <button className={`button button--${mode} ${iconPosition === "right" ? "reverse" : ""}`} onClick={onClick}>
            {   icon &&
                <span className="material-symbols-outlined icon">
                    {icon}
                </span>
            }
            {text}
        </button>
    )

}