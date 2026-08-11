import "./AdminVentas.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { cancelarVenta, crearVenta, getVentas, updateEstadoVenta } from "../../shared/services/ventas.services"
import { useEffect, useState } from "react"
import { useAdminCRUD } from "../../shared/hooks/useAdminCRUD"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { NewElemForm } from "../../shared/components/forms/NewElemForm/NewElemForm"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { ventas_columns, searchFields } from "./data/ventas.config"

const opciones_estado = [
    { id: "pendiente", label: "Pendiente", value: "pendiente" },
    { id: "pagado", label: "Pagado", value: "pagado" },
    { id: "enviado", label: "Enviado", value: "enviado" },
    { id: "entregado", label: "Entregado", value: "entregado" },

]

const inputs = [
    { id: "venta__estado", label: "Estado de Venta", type: "select", mappedProp: "estado", is_mandatory: true, options: opciones_estado }
]

export function AdminVentas(){
    
    const {
        items,
        showEditForm,
        editingElem,
        confirmState,
        handleCancel,
        handleCancelItem,
        handleConfirm,
        closeEditForm,
        handleRequestEdit,
        handleSubmitEdit,
    } = useAdminCRUD({
        getAll: getVentas,
        create: crearVenta,
        update: updateEstadoVenta,
        remove: cancelarVenta,
        entityName: "Venta",
        inputsConfig: inputs
    })

    const handleCancelarVenta = (venta) => {
        handleCancelItem(
            venta.id,
            `¿Estás seguro que querés cancelar el pedido ${venta.codigo}? Se devolverá el stock de los productos y no se puede deshacer.`
        )
    }

    const columns = ventas_columns(handleRequestEdit, handleCancelarVenta)

    return(

        <div className="admin__section admin__ventas">

            <SectionTitle 
                title={"Ventas"}
                subtitle={"Gestiona los pedidos de tu tienda."}
            />

            <TableContainer
                data={items}
                columns={columns}
                searchFields={searchFields}
                placeholderInput={"Buscar por nombre o código de venta"}
                messageNoSearch={"No tienes ventas realizadas aún."}/>

            {
                confirmState &&
                <ConfirmModal
                    message={confirmState.message}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}/>
            }

            {
                showEditForm &&
                <EditForm 
                    title={"Editar Venta"}
                    editingElem={editingElem}
                    onSubmit={handleSubmitEdit}
                    onExit={closeEditForm}/>
            }

        </div>

    )

}