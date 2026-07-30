import "./FieldOptionsEditor.css"

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { FieldOptionItem } from "../FieldOptionItem/FieldOptionItem"
import { useState } from "react"

export function FieldOptionsEditor ({name_input, options, onSubmitNewOption, onDeleteOption, onReorderOptions}){

    const [newOptionValue, setNewOptionValue] = useState("")

    const onChangeInput = (e) => {

        const newValue = e.target.value
        setNewOptionValue(newValue)

    }

    const optionsFiltred = Array.isArray(options) ? options : []

    const handleOnSubmit = (e) => {

        onSubmitNewOption(e, name_input, newOptionValue)

        setNewOptionValue("")
    }

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        const oldIndex = optionsFiltred.indexOf(active.id)
        const newIndex = optionsFiltred.indexOf(over.id)

        if (oldIndex === -1 || newIndex === -1) return

        onReorderOptions(oldIndex, newIndex)
    }


    return(
        <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={optionsFiltred}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="field__options__edit">

                        <h3>Opciones</h3>

                            {
                                optionsFiltred.map(opt => 
                                    
                                    <FieldOptionItem 
                                                key={opt.id}
                                                id={opt.id}
                                                option={opt} 
                                                onDelete={onDeleteOption}/>

                                )

                            }
                        

                        <div className="add__option__container">
                            <input type="text" placeholder="Nueva Opción" value={newOptionValue} onChange={onChangeInput}/>
                            <button onClick={handleOnSubmit}>
                                <img src="/img/add_FFF.png" alt="Agregar Opción" title="Agregar Opción"/>
                            </button>
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

    )
}