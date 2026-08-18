import "./AdminMarcas.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { createMarca, deleteMarca, getMarcasConCantidad, updateMarca } from "../../shared/services/marcas.services"
import { MarcaItem } from "./components/MarcaItem/MarcaItem"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { useAdminCRUD } from "../../shared/hooks/useAdminCRUD"
import { generateSlug } from "../../shared/utils/generateSlug"
import { Pagination } from "../../shared/components/ui/Pagination/Pagination"
import { MarcaSkeleton } from "./components/MarcaSkeleton/MarcaSkeleton"
import { Skeleton } from "../../shared/components/ui/Skeleton/Skeleton"

const marca_inputs = [
    { id: "marca_nombre", name: "marca_nombre", type: "text", label: "Nombre de la Marca", mappedProp: "nombre", is_mandatory: true },
    { id: "marca_slug", name: "marca_slug", type: "text", label: "Slug", mappedProp: "slug", is_mandatory: true, autoGenerateFrom: "marca_nombre", generationFunction: generateSlug }

]


export function AdminMarcas() {

    const {
        items: marcas,
        totalCount,
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
        search,
        setSearch,
        pagination,
        setPage,
        isFiltering,
        loading
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
                subtitle={
                    loading
                        ? <><Skeleton width="20px" height="0.9rem" style={{ display: "inline-block", verticalAlign: "middle" }} /> productos en tu catálogo.</>
                        : `${totalCount ?? 0} marcas registradas.`
                }
                buttonText={"Nueva Marca"}
                onClick={openNewForm}
                isLoading={loading}/>

            <div className="admin__marcas__container">
                <div className="marcas__items">
                    {loading ?
                        (
                            Array.from({length: 9}).map((_, i) => (
                                <MarcaSkeleton key={i}/>
                            ))
                        ) :
                        marcas?.map(m => (
                            <MarcaItem
                                key={m.id}
                                marca={m}
                                onDelete={handleDelete}
                                onEdit={handleRequestEdit} />
                        ))
                    }

                </div>
                <Pagination 
                    pagination={pagination}
                    onPageChange={setPage}/>
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