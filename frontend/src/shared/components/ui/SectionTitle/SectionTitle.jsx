import "./SectionTitle.css"
import { Button } from "../Button/Button"

export function SectionTitle({
    title,
    subtitle,
    buttonText, 
    buttonIcon = "add",
    onClick
}){
    
    return(

        <div className="section__title__container">
            <div>
                <h3 className="admin__section__title">{title}</h3>
                <p className="admin__section__subtitle">{subtitle}</p>
            </div>

            {
                buttonText && 
                <Button
                    text={buttonText}
                    onClick={onClick}
                    icon={buttonIcon} />
            }
            
            
        </div>

    )

}