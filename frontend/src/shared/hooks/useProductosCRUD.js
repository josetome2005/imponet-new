// hooks/useProductosCRUD.js
import { useState, useEffect } from "react";
import { useConfirm } from "./useConfirm";
import { useToast } from "../components/toast/ToastContext";
import { createProducto, updateProducto, deleteProducto, searchProductos } from "../services/productos.services";
import { useRemoteTableData } from "./useRemoteTableData";

// Adaptador: useRemoteTableData espera { data, pagination }, el backend nos da { productos, pagination }
const fetchProductosAdapter = async (queryParams) => {
    const { productos, pagination } = await searchProductos(queryParams)
    return { data: productos, pagination }
}

export function useProductosCRUD({ filters } = {})  {

    const table = useRemoteTableData(fetchProductosAdapter, { filters, perPage: 10 })

    const [showNewForm, setShowNewForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingElem, setEditingElem] = useState(null);

    const { state, confirm, handleCancel, handleConfirm } = useConfirm();
    const toast = useToast();

    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        async function fetchTotalCount() {
            const { pagination } = await searchProductos({ page: 1, perPage: 1 })
            setTotalCount(pagination.total)
        }
        fetchTotalCount()
    }, [])

    const openNewForm = () => setShowNewForm(true);
    const closeNewForm = () => setShowNewForm(false);

    const openEditForm = (producto) => {
        setEditingElem(producto);
        setShowEditForm(true);
    };
    const closeEditForm = () => {
        setShowEditForm(false);
        setEditingElem(null);
    };

    const handleDelete = async (id) => {
        const ok = await confirm("Esta acción no se puede deshacer. ¿Estás seguro que querés eliminar este producto?");
        if (!ok) return;

        try {
            await deleteProducto(id);
            toast.success("Se ha eliminado el producto correctamente.");
            table.refetch()
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al eliminar el producto.");
        }
    };

    // { fields, imagenesOrden, archivosNuevos } viene de ProductoForm
    const handleSubmitNew = async ({ fields, archivosNuevos }) => {
        try {
            await createProducto({ object: fields, imagenes: archivosNuevos });
            toast.success("Se ha creado el producto correctamente.");
            table.refetch()
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al crear el producto.");
        }
    };

    const handleSubmitEdit = async ({ fields, imagenesOrden, archivosNuevos }) => {
        const { id, ...rest } = fields;
        try {
            await updateProducto({ id, object: rest, imagenesOrden, archivosNuevos });
            toast.success("Se ha editado el producto correctamente.");
            table.refetch()
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al editar el producto.");
        }
    };

    return {
        // CRUD
        totalCount,
        showNewForm,
        showEditForm,
        editingElem,
        confirmState: state,
        handleCancel,
        handleConfirm,
        openNewForm,
        closeNewForm,
        openEditForm,
        closeEditForm,
        handleDelete,
        handleSubmitNew,
        handleSubmitEdit,

        // Todo lo de la tabla (data, search, filtros, paginación) ya viene armado
        productos: table.data,
        loading: table.loading,
        search: table.search,
        setSearch: table.setSearch,
        activeFilters: table.activeFilters,
        setActiveFilter: table.setActiveFilter,
        filterGroups: table.filterGroups,
        isFiltering: table.isFiltering,
        pagination: table.pagination,
        setPage: table.setPage,
    };
}