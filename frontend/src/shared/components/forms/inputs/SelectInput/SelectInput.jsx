import "./SelectInput.css"
import { useState, useMemo } from "react"
import { useClickOutside } from "../../../../hooks/useClickOutside"

export function SelectInput({name_input, activeOption, options, onSelect, disabled, messageNoOptions, canAddOptions = false}){

    const usedOptions = useMemo(() => {
        return options.filter(opt => opt.value !== activeOption)
    }, [options, activeOption])

    const [newOption, setNewOption] = useState("")
    const { open, ref, toggle, close } = useClickOutside()

    const handleSelect = (item) => {
        onSelect(item, name_input);
        close()
    }

    const handleClick = () =>{
        if(disabled) return;
        toggle()
    }

    const handleChangeNewOption = (e) => {
        const { value } = e.target;
        setNewOption(value)
    }

    const handleAddNewOption = () => {
        if (newOption.trim() === "") return;

        const new_option = {
            id: crypto.randomUUID(),
            label: newOption,
            value: newOption,
            isVirtualOption: true
        }

        onSelect(new_option, name_input)

        setNewOption("")
        close()
    }

    const matchedOption = options.find(opt => opt.value === activeOption)
    const activeOptionLabel = matchedOption ? matchedOption.label : activeOption

    return(

        <div className={`select__input ${open ? "open" : ""} ${disabled ? "select_input--disabled" : ""}`} ref={ref} title={`${disabled ? "No puede editar el tipo del campo una vez creado." : "" }`}>
            
            <div className="select__header" onClick={handleClick}>
                <span className="">{activeOptionLabel}</span>
                <span className="material-symbols-outlined icon"> 
                    keyboard_arrow_down
                </span>
            </div>

            <div className="dropdown__menu">
                
                {
                    usedOptions.map( item => (
                        <span key={item.id} className="select__option" onClick={() => handleSelect(item)}>{item.label}</span>
                    ))
                }
                {
                    canAddOptions && (
                        <span className="select__option select__option--add-option">
                            <input type="text" value={newOption} onChange={handleChangeNewOption}/>
                            <button className="button__to__add" onClick={handleAddNewOption}>
                                <span className="material-symbols-outlined">
                                    done
                                </span>
                            </button>
                        </span>
                    )
                }

                {
                    options.length === 0 && (
                        <p className="message_no_options">
                            {messageNoOptions || "No tienes opciones cargadas"}
                        </p>
                    )
                }

            </div>

        </div>

    )




}