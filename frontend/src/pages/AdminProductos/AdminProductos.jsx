import "./AdminProductos.css"
import { useEffect, useState } from "react"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { ProductoForm } from "./components/ProductoForm/ProductoForm"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { getMarcas } from "../../shared/services/marcas.services"
import { getCategorias } from "../../shared/services/categorias.services"
import { useProductosCRUD } from "../../shared/hooks/useProductosCRUD"
import { searchFields, filters, buildProductoInputs, buildProductosColumns } from "./data/productos.config"
import { Skeleton } from "../../shared/components/ui/Skeleton/Skeleton"

export function AdminProductos() {

    const [marcas, setMarcas] = useState([])
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        async function fetchOptions() {
            const [{items: m}, {items: c}] = await Promise.all([getMarcas(), getCategorias()])
            setMarcas(m)
            setCategorias(c)
        }
        fetchOptions()
    }, [])

    const {
        productos,
        totalCount,
        isSubmitting,
        loadingTotal,
        showNewForm,
        showEditForm,
        editingElem,
        confirmState,
        handleCancel, handleConfirm,
        openNewForm,
        closeNewForm,
        openEditForm,
        closeEditForm,
        handleDelete,
        handleSubmitNew,
        handleSubmitEdit,
        search,
        setSearch,
        activeFilters,
        setActiveFilter,
        filterGroups,
        isFiltering,
        pagination,
        setPage,
        loading
    } = useProductosCRUD({ filters })

    const producto_inputs = buildProductoInputs({ marcas, categorias })
    const productos_columns = buildProductosColumns({ onEdit: openEditForm, onDelete: handleDelete })

    return (
        <div className="admin__section admin__productos">
            <SectionTitle
                title={"Productos"}
                subtitle={
                    loadingTotal
                        ? <><Skeleton width="20px" height="0.9rem" style={{ display: "inline-block", verticalAlign: "middle" }} /> productos en tu catálogo.</>
                        : `${totalCount ?? 0} productos en tu catálogo.`
                }
                buttonText={"Nuevo Producto"}
                onClick={openNewForm}
            />

            <TableContainer
                data={productos}
                columns={productos_columns}
                messageNoSearch={"Aún no tienes cargados productos"}
                placeholderInput={"Buscar por nombre o SKU"}
                
                search={search}
                onSearchChange={setSearch}

                activeFilters={activeFilters}
                onFilterChange={setActiveFilter}
                filterGroups={filterGroups}

                pagination={pagination}
                onPageChange={setPage}

                isFiltering={isFiltering}
                isLoading={loading}
            />

            {confirmState && (
                <ConfirmModal
                    message={confirmState.message}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            )}

            {showNewForm && (
                <ProductoForm
                    title={"Nuevo Producto"}
                    inputsConfig={producto_inputs}
                    editingElem={null}
                    onSubmit={handleSubmitNew}
                    onExit={closeNewForm}
                    isSubmitting={isSubmitting}
                />
            )}

            {showEditForm && (
                <ProductoForm
                    title={"Editar Producto"}
                    inputsConfig={producto_inputs}
                    editingElem={editingElem}
                    onSubmit={handleSubmitEdit}
                    onExit={closeEditForm}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    )
}