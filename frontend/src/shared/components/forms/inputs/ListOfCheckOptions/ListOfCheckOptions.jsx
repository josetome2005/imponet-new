import "./ListOfCheckOptions.css"

export function ListOfCheckOptions({name_input, checkedOptions, options, onToggle}){

    return(
        
        <div style={{width: "100%"}}>
            <div className="check_options__container">
                
                {
                    options.map(option => (

                        <div key={option.id} className="option__item">
                            <label>
                                <input type="checkbox" checked={checkedOptions.includes(option.value)} onChange={() => onToggle(name_input, option.value)} />
                                <span>{option.label}</span>
                            </label>
                        </div>
                    ))
                }

            </div>
        </div>

    )

}