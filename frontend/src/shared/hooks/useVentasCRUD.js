import { useState, useEffect, useCallback} from "react";
import { useConfirm } from "./useConfirm";
import { useToast } from "../components/toast/ToastContext";
import { useRemoteTableData } from "./useRemoteTableData";
import { getVentas, crearVenta, updateEstadoVenta, cancelarVenta, getTotalVentas } from "../services/ventas.services";

// Adaptador: backend devuelve { items, pagination }, el hook genérico espera { data, pagination }
const fetchVentasAdapter = async (queryParams) => {
    const { items, pagination } = await getVentas(queryParams)
    return { data: items, pagination }
}

export function useVentasCRUD({ tabs, inputsConfig } = {}) {

    const table = useRemoteTableData(fetchVentasAdapter, { tabs, perPage: 10 })

    const [showEditForm, setShowEditForm] = useState(false);
    const [editingElem, setEditingElem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { state, confirm, handleCancel, handleConfirm } = useConfirm();
    const toast = useToast();

    const [totalCount, setTotalCount] = useState(0)
    const [loadingTotal, setLoadingTotal] = useState(true)

    const refetchTotal = useCallback(async () => {
        setLoadingTotal(true)
        try {
            const { total } = await getTotalVentas()
            setTotalCount(total)
        } finally {
            setLoadingTotal(false)
        }
    }, [])

    useEffect(() => {
        refetchTotal()
    }, [refetchTotal])

    const closeEditForm = () => {
        setShowEditForm(false);
        setEditingElem(null);
    };

    const handleRequestEdit = (venta) => {
        setEditingElem({
            id: venta.id,
            inputs: inputsConfig.map(input => ({
                ...input,
                value: venta[input.mappedProp]
            }))
        })
        setShowEditForm(true);
    };

    const handleSubmitEdit = async (formData) => {
        const { id, ...rest } = formData;
        setIsSubmitting(true)
        try {
            await updateEstadoVenta({ id, ...rest });
            await table.refetch();
            toast.success("Se ha editado la venta correctamente.");
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al editar la venta.");
        }finally{
            setIsSubmitting(false)
        }
    };

    const handleCancelItem = async (id, mensajeConfirm) => {
        const ok = await confirm(mensajeConfirm ?? "¿Estás seguro que querés cancelar esta venta?");
        if (!ok) return;
        setIsSubmitting(true)
        try {
            await cancelarVenta(id);
            await table.refetch();
            toast.success("Se ha cancelado la venta correctamente.");
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al cancelar la venta.");
        }finally{
            setIsSubmitting(false)
        }
    };

    return {
        ventas: table.data,
        isSubmitting,
        totalCount,
        loadingTotal,
        showEditForm,
        editingElem,
        confirmState: state,
        handleCancel,
        handleConfirm,
        closeEditForm,
        handleRequestEdit,
        handleSubmitEdit,
        handleCancelItem,

        search: table.search,
        setSearch: table.setSearch,
        activeTab: table.activeTab,
        setActiveTab: table.setActiveTab,
        filterGroups: table.filterGroups,
        isFiltering: table.isFiltering,
        pagination: table.pagination,
        setPage: table.setPage,
        loading: table.loading
    };
}