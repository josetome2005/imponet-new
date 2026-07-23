import "./Button.css"

export function Button({mode = "default", text, icon, iconPosition="left"}){


    return(

        <button className={`button button--${mode} ${iconPosition === "right" ? "reverse" : ""}`}>
            {   icon &&
                <span className="material-symbols-outlined icon">
                    {icon}
                </span>
            }
            {text}
        </button>
    )

}