import "./EmptyState.css"
import { Button } from "../Button/Button"

export function EmptyState({
    icon,
    title,
    description,

    useInput,
    inputValue,
    onChange,
    inputPlaceholder,

    buttonText,
    buttonIcon,
    onClick,
    disabled,
    buttonMode

}){
    return(
        <div className="empty__state">
            <div className="empty__state__icon">
                <span className="material-symbols-outlined">
                    {icon}
                </span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>

            <div className="input__container">
                {
                    useInput &&
                    <input
                        type="text"
                        placeholder={inputPlaceholder ?? ""}
                        value={inputValue}
                        onChange={onChange}
                    />
                }
                
                <Button
                    mode={buttonMode}
                    text={buttonText}
                    icon={buttonIcon}
                    iconPosition={"right"} 
                    onClick={onClick}
                    disabled={disabled}
                />
            </div>
            
        </div>
    )

}