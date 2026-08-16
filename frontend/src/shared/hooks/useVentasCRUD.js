import { useState, useEffect} from "react";
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

    const { state, confirm, handleCancel, handleConfirm } = useConfirm();
    const toast = useToast();

    const [totalCount, setTotalCount] = useState(0)
    
    useEffect(() => {
        async function fetchTotalCount() {
            const { pagination } = await getVentas({ page: 1, perPage: 1 })
            setTotalCount(pagination.total)
        }
        fetchTotalCount()
    }, [])

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
        try {
            await updateEstadoVenta({ id, ...rest });
            toast.success("Se ha editado la venta correctamente.");
            table.refetch();
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al editar la venta.");
        }
    };

    const handleCancelItem = async (id, mensajeConfirm) => {
        const ok = await confirm(mensajeConfirm ?? "¿Estás seguro que querés cancelar esta venta?");
        if (!ok) return;

        try {
            await cancelarVenta(id);
            toast.success("Se ha cancelado la venta correctamente.");
            table.refetch();
        } catch (e) {
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al cancelar la venta.");
        }
    };

    return {
        ventas: table.data,
        totalCount,
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
    };
}