import "./DropdownFilter.css"
import { useClickOutside } from "../../../hooks/useClickOutside"

export function DropdownFilter ({activeFilter, filters, onSelect, placeholder}){

    const { open, ref, toggle, close } = useClickOutside()

    const selectedOption = filters?.find(f => f.filter === activeFilter)

    const handleSelect = (value) => {
        onSelect(value);
        close()
    }

    return(

        <div className={`dropdown ${open ? "open" : ""}`} ref={ref}>

            <button className="dropdown__trigger" onClick={toggle}>
                <span className="material-symbols-outlined filter__img">
                    filter_alt
                </span>
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className="material-symbols-outlined dropdown__img">
                    stat_minus_1
                </span>
            </button>


            <div className="dropdown__menu">

                {filters?.map(filt => (
                    <div key={filt.filter} className={`dropdown__item ${activeFilter === filt.filter ? "selected" : ""}`}  onClick={() => handleSelect(filt.filter)}>
                        <span>{filt.label}</span>
                    </div>
                ))}
                
            </div>
            
        </div>

    )

}