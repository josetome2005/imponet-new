import "./AdminCategorias.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { createCategoria, deleteCategoria, getCategoriasConCantidad, updateCategoria } from "../../shared/services/categorias.services"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { searchFields, categorias_columns } from "./data/categorias.config"
import { useAdminCRUD } from "../../shared/hooks/useAdminCRUD"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"


const categoria_inputs = [
    { id: "categoria_nombre", name: "categoria_nombre", type: "text", label: "Nombre de la Categoría", mappedProp: "nombre", is_mandatory: true }
]


export function AdminCategorias() {
  
    const {
        items: categorias,
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
        getAll: getCategoriasConCantidad,
        create: createCategoria,
        update: updateCategoria,
        remove: deleteCategoria,
        entityName: "marca",
        inputsConfig: categoria_inputs,
    })


    const columns = categorias_columns(handleRequestEdit, handleDelete)

    

    return (

        <div className="admin__section admin__categorias">
            <SectionTitle 
                title={"Categorías"}
                subtitle={`${categorias.length} categorias activas`}
                buttonText={"Nueva Categoria"}
                onClick={openNewForm}/>

            <TableContainer
                data={categorias}
                columns={columns}
                searchFields={searchFields}
                placeholderInput={"Buscar por nombre"}
                messageNoSearch={"No tienes categorías"}/>

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
                    title={"Agregar Categoría"}
                    inputs={categoria_inputs}
                    handleSubmit={handleSubmitNew}
                    handleExit={closeNewForm}/>
            }

            {
                showEditForm &&
                <EditForm 
                    title={"Editar Categoría"}
                    editingElem={editingElem}
                    onSubmit={handleSubmitEdit}
                    onExit={closeEditForm}/>
            }
        </div>
    )

}