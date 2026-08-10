import "./Button.css"

export function Button({
    mode = "default", 
    text, 
    icon, 
    iconPosition="left", 
    onClick,
    disabled}){


    return(

        <button 
            className={`button button--${mode} ${iconPosition === "right" ? "reverse" : ""}`} 
            onClick={onClick}
            disabled={disabled}
        >
            {   icon &&
                <span className="material-symbols-outlined icon">
                    {icon}
                </span>
            }
            {text}
        </button>
    )

}