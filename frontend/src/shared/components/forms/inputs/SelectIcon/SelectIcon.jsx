import "./SelectIcon.css"

export function SelectIcon({name_input, value, options, onChange}){


    
    return(

        <div className="select__icon__container">
            
            {
                options.map(opt => {

                    const isActive = value == "/img/"+opt;

                    return(
                        <div key={opt} className={`option__icon ${isActive ? "option__icon--active" : ""}`} onClick={() => onChange(name_input, opt)}>
                            <img src={"/img/"+opt} alt="" />
                        </div>
                    )

                    })
            }    
        

        </div>
    )

}