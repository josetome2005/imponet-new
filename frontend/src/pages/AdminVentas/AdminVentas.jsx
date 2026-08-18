import "./AdminVentas.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { cancelarVenta, crearVenta, getVentas, updateEstadoVenta } from "../../shared/services/ventas.services"
import { useEffect, useState } from "react"
import { useAdminCRUD } from "../../shared/hooks/useAdminCRUD"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { ventas_columns, searchFields, inputs, tabs } from "./data/ventas.config"
import { DetalleVentaModal } from "./components/DetalleVentaModal/DetalleVentaModal"
import { useVentasCRUD } from "../../shared/hooks/useVentasCRUD"

export function AdminVentas(){
    
    const {
        ventas,
        totalCount,
        loadingTotal,
        showEditForm,
        editingElem,
        confirmState,
        handleCancel,
        handleCancelItem,
        handleConfirm,
        closeEditForm,
        handleRequestEdit,
        handleSubmitEdit,
        search,
        setSearch,
        activeTab,
        setActiveTab,
        filterGroups,
        isFiltering,
        pagination,
        setPage,
        loading
    } = useVentasCRUD({ tabs, inputsConfig: inputs })

    const [ventaVistaId, setVentaVistaId] = useState(null)

    const ventaVista = ventaVistaId
        ? items.find((v) => v.id === ventaVistaId)
        : null 

    const handleCancelarVenta = (venta) => {
        handleCancelItem(
            venta.id,
            `¿Estás seguro que querés cancelar el pedido ${venta.codigo}? Se devolverá el stock de los productos y no se puede deshacer.`
        )
    }

    const handleSeeVenta = (venta) => {
        setVentaVistaId(venta.id)
    }

    const columns = ventas_columns(handleRequestEdit, handleCancelarVenta, handleSeeVenta)

    return(

        <div className="admin__section admin__ventas">

            <SectionTitle 
                title={"Ventas"}
                subtitle={"Gestiona los pedidos de tu tienda."}
            />

            <TableContainer
                data={ventas}
                columns={columns}
                messageNoSearch={"No tienes ventas realizadas aún."}
                placeholderInput={"Buscar por nombre o código de venta"}

                search={search}
                onSearchChange={setSearch}

                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}

                pagination={pagination}
                onPageChange={setPage}

                isFiltering={isFiltering}
                isLoading={loading}
            />  

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

            {
                ventaVista &&
                <DetalleVentaModal 
                    venta={ventaVista}
                    onClose={() => setVentaVistaId(null)}
                    onCancel={handleCancelarVenta}
                    onEdit={handleRequestEdit}/>
            }

        </div>

    )

}