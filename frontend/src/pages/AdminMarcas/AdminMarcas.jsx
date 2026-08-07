import "./AdminMarcas.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { createMarca, deleteMarca, getMarcasConCantidad, updateMarca } from "../../shared/services/marcas.services"
import { MarcaItem } from "./components/MarcaItem/MarcaItem"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { useAdminCRUD } from "../../shared/hooks/useAdminCRUD"

const marca_inputs = [
    { id: "marca_nombre", name: "marca_nombre", type: "text", label: "Nombre de la Marca", mappedProp: "nombre", is_mandatory: true }
]


export function AdminMarcas() {

    const {
        items: marcas,
        showNewElemForm,
        showEditForm,
        openNewForm,
        closeEditForm,
        closeNewForm,
        editingElem,
        confirmState,
        handleCancel, handleConfirm,
        handleDelete,
        handleRequestEdit,
        handleSubmitEdit,
        handleSubmitNew,

    } = useAdminCRUD({
        getAll: getMarcasConCantidad,
        create: createMarca,
        update: updateMarca,
        remove: deleteMarca,
        entityName: "marca",
        inputsConfig: marca_inputs,
    })
      
    return (

        <div className="admin__section admin__marcas">
            <SectionTitle 
                title={"Marcas"}
                subtitle={`${marcas.length} marcas registradas`}
                buttonText={"Nueva Marca"}
                onClick={openNewForm}/>

            <div className="admin__marcas__container">
                {
                    marcas?.map(m => (
                        <MarcaItem
                            key={m.id} 
                            marca={m}
                            onDelete={handleDelete}
                            onEdit={handleRequestEdit}/>
                    ))
                }
            </div>

            {
                confirmState &&
                <ConfirmModal
                    message={confirmState.message}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}/>
            }

            {
                showNewElemForm &&
                <NewElemForm 
                    title={"Agregar Marca"}
                    inputs={marca_inputs}
                    handleSubmit={handleSubmitNew}
                    handleExit={closeNewForm}/>
            }

            {
                showEditForm &&
                <EditForm 
                    title={"Editar Marca"}
                    editingElem={editingElem}
                    onSubmit={handleSubmitEdit}
                    onExit={closeEditForm}/>
            }
        </div>
    )

}