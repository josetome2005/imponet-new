import "./FieldOptionItem.css"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export function FieldOptionItem({id, option, onDelete}){

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }


    return(

        <div 
            className="field__option__item"
            ref={setNodeRef}
            {...attributes}
            style={style}>

            <img src="/img/drag_666.png" alt="Mover" title="Mover" className="handler__icon" {...listeners}/>

            <span>{option.value}</span>

            <img src="/img/delete_red.png" alt="Eliminar Opción" title="Eliminar Opción" className="delete__icon" onClick={() => onDelete(option)}/>

        </div>

    )


}