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

export function AdminProductos() {

    const [marcas, setMarcas] = useState([])
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        async function fetchOptions() {
            const [m, c] = await Promise.all([getMarcas(), getCategorias()])
            setMarcas(m)
            setCategorias(c)
        }
        fetchOptions()
    }, [])

    const {
        productos,
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
        handleSubmitEdit
    } = useProductosCRUD()

    const producto_inputs = buildProductoInputs({ marcas, categorias })

    // le paso openEditForm/handleDelete a las columnas para que la tabla tenga acciones por fila
    const productos_columns = buildProductosColumns({ onEdit: openEditForm, onDelete: handleDelete })

    return (
        <div className="admin__section admin__productos">
            <SectionTitle
                title={"Productos"}
                subtitle={`${productos.length} productos en tu catálogo.`}
                buttonText={"Nuevo Producto"}
                onClick={openNewForm}
            />

            <TableContainer
                data={productos}
                columns={productos_columns}
                searchFields={searchFields}
                filters={filters}
                placeholderInput={"Buscar por nombre o SKU"}
                messageNoSearch={"Aún no tienes cargados productos"}
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
                />
            )}

            {showEditForm && (
                <ProductoForm
                    title={"Editar Producto"}
                    inputsConfig={producto_inputs}
                    editingElem={editingElem}
                    onSubmit={handleSubmitEdit}
                    onExit={closeEditForm}
                />
            )}
        </div>
    )
}