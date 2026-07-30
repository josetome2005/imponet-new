import "./FlagMatrix.css"

export function FlagMatrix({name_input, config, columns, rows, value, onChange}){

    return(
        <div className="container__flag__matrix">

            <div className="flag__matrix__row flag__matrix__header">

                <div className="flag__matrix__label flag__matrix__first__item">Módulo</div>
                {
                    columns?.map(col => (
                        <div className="flag__matrix__label">
                            {col.label}
                        </div>
                    ))
                }

            </div>


            {
                rows?.map( row => (
                    
                    <div className="flag__matrix__row">

                        <div className="flag__matrix__label flag__matrix__first__item">{row.label}</div>

                        {
                            config[row.key].map(item => (
                                <div className="flag__matrix__item">

                                    <input type="checkbox" checked={!!value?.[row.key]?.[item]} onChange={() => onChange(name_input, row.key, item)}/>

                                </div>
                            ))
                        }

                    </div>

                ))
            }


        </div>
    )

}