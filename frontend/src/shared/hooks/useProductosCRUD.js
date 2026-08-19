// hooks/useProductosCRUD.js
import { useState, useEffect, useCallback } from "react";
import { useConfirm } from "./useConfirm";
import { useToast } from "../components/toast/ToastContext";
import { createProducto, updateProducto, deleteProducto, searchProductos, getTotalProductos } from "../services/productos.services";
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
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { state, confirm, handleCancel, handleConfirm } = useConfirm();
    const toast = useToast();

    const [totalCount, setTotalCount] = useState(null)
    const [loadingTotal, setLoadingTotal] = useState(true)

    const refetchTotal = useCallback(async () => {
        setLoadingTotal(true)
        try {
            const { total } = await getTotalProductos()
            setTotalCount(total)
        } finally {
            setLoadingTotal(false)
        }
    }, [])

    useEffect(() => {
        refetchTotal()
    }, [refetchTotal])

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

        setIsSubmitting(true)
        try {
            await deleteProducto(id);
            await table.refetch()
            toast.success("Se ha eliminado el producto correctamente.");
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al eliminar el producto.");
        }finally{
            setIsSubmitting(false)
        }
    };

    // { fields, imagenesOrden, archivosNuevos } viene de ProductoForm
    const handleSubmitNew = async ({ fields, archivosNuevos }) => {
        setIsSubmitting(true)
        try {
            await createProducto({ object: fields, imagenes: archivosNuevos });
            await table.refetch()
            toast.success("Se ha creado el producto correctamente.");
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al crear el producto.");
        }finally{
            setIsSubmitting(false)   
        }
    };

    const handleSubmitEdit = async ({ fields, imagenesOrden, archivosNuevos }) => {
        const { id, ...rest } = fields;
        setIsSubmitting(true)
        try {
            await updateProducto({ id, object: rest, imagenesOrden, archivosNuevos });
            await table.refetch()
            toast.success("Se ha editado el producto correctamente.");
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al editar el producto.");
        }finally{
            setIsSubmitting(false)
        }
    };

    return {
        // CRUD
        totalCount,
        loadingTotal,
        isSubmitting,
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