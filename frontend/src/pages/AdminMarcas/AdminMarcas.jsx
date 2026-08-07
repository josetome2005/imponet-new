import "./AdminMarcas.css"
import { useEffect, useState } from "react"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { createMarca, deleteMarca, getMarcasConCantidad, updateMarca } from "../../shared/services/marcas.services"
import { MarcaItem } from "./components/MarcaItem/MarcaItem"
import { useConfirm } from "../../shared/hooks/useConfirm"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { useToast } from "../../shared/components/toast/ToastContext"

const marca_inputs = [
    { id: "marca_nombre", name: "marca_nombre", type: "text", label: "Nombre de la Marca", mappedProp: "nombre", is_mandatory: true }
]


export function AdminMarcas() {

    const [ marcas, setMarcas ] = useState([])
    const [ showNewElemForm, setShowNewElemForm ] = useState(false)
    const [ showEditForm, setShowEditForm ] = useState(false)
    const [ editingElem, setEditingElem ] = useState(null)
    const { state, confirm, handleCancel, handleConfirm } = useConfirm()

    useEffect(() => {
        async function getMs(){
            const ms = await getMarcasConCantidad()
            setMarcas(ms)
        }
        getMs()
    }, [])

    /*-------------- HANDLERS -------------------*/

    const toast = useToast()

    const handleDeleteMarca = async (id) => {
        const ok = await confirm("Esta acción no se puede deshacer. ¿Estás seguro que quieres eliminar esta marca?")
        if(!ok) return;

        const marca_a_eliminar_index = marcas.findIndex(m => m.id = id)
        if(marca_a_eliminar_index === -1) return;

        const marca_a_eliminar = marcas[marca_a_eliminar_index]
        
        setMarcas(prev => prev.filter(m => m.id !== id))

        try{
            await deleteMarca(id);
            toast.success("Se ha eliminado la marca correctamente.")

        }catch(e){
            console.log(e)
            
            setMarcas(prev => [
                ...prev.slice(0, marca_a_eliminar_index),
                marca_a_eliminar,
                ...prev.slice(marca_a_eliminar_index)
            ])
            toast.error("Ha ocurrido un error al eliminar la marca.")

        }


    }

    const handleRequestEdit = (elem) => {
        setEditingElem({    
            id: elem.id ?? "",
            inputs: marca_inputs.map(input => ({
                ...input,
                value: elem[input.mappedProp]
            }))
        })

        setShowEditForm(true)
    }

    const handleSubmitEdit = async (formData) => {
        const { nombre, id } = formData

        try {
            await updateMarca({ id, nombre })
            setMarcas(prev => prev.map(m => 
                m.id === id
                    ? { ...m, nombre }
                    : m
            ))
            toast.success("Se ha editado la marca correctamente.")

        } catch (e) {
            console.log(e)
            toast.error("Ha ocurrido un error al eliminar la marca.")
        }
    }

    const handleSubmitNew = async (formData) => {

        const { nombre } = formData

        try{
            const nueva_marca = await createMarca({nombre})
            setMarcas(prev => [...prev, nueva_marca])
            toast.success("Se ha creado la marca correctamente.")
        }catch(e){
            console.log(e)
            toast.success("Ha ocurrido un error creando la marca.")
        }

    }

      
    return (

        <div className="admin__section admin__marcas">
            <SectionTitle 
                title={"Marcas"}
                subtitle={`${marcas.length} marcas registradas`}
                buttonText={"Nueva Marca"}
                onClick={() => setShowNewElemForm(true)}/>

            <div className="admin__marcas__container">
                {
                    marcas?.map(m => (
                        <MarcaItem
                            key={m.id} 
                            marca={m}
                            onDelete={handleDeleteMarca}
                            onEdit={handleRequestEdit}/>
                    ))
                }
            </div>

            {
                state &&
                <ConfirmModal
                    message={state.message}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}/>
            }

            {
                showNewElemForm &&
                <NewElemForm 
                    title={"Agregar Marca"}
                    inputs={marca_inputs}
                    handleSubmit={handleSubmitNew}
                    handleExit={() => setShowNewElemForm(false)}/>
            }

            {
                showEditForm &&
                <EditForm 
                    title={"Editar Marca"}
                    editingElem={editingElem}
                    onSubmit={handleSubmitEdit}
                    onExit={() => setShowEditForm(false)}/>
            }
        </div>
    )

}