import { useState, useEffect} from "react";
import { useConfirm } from "./useConfirm";
import { useToast } from "../components/toast/ToastContext";
import { useRemoteTableData } from "./useRemoteTableData";
import { darDeBajaNewsletter, getNewsletterSuscriptores } from "../services/newsletter.services";

// Adaptador: backend devuelve { items, pagination }, el hook genérico espera { data, pagination }
const fetchNewsletterAdapter = async (queryParams) => {
    const { items, pagination } = await getNewsletterSuscriptores(queryParams)
    return { data: items, pagination }
}

export function useNewsletterCRUD({ filters } = {}) {
    const table = useRemoteTableData(fetchNewsletterAdapter, { filters, perPage: 10 })

    const { state, confirm, handleCancel, handleConfirm } = useConfirm();
    const toast = useToast();

    const [totalCount, setTotalCount] = useState(0)
    
    useEffect(() => {
        async function fetchTotalCount() {
            const { pagination } = await getNewsletterSuscriptores({ page: 1, perPage: 1 })
            setTotalCount(pagination.total)
        }
        fetchTotalCount()
    }, [])

    const handleDarDeBaja = async (email, mensajeConfirm) => {
        const ok = await confirm(mensajeConfirm ?? "¿Estás seguro que querés dar de baja esta suscripción?");
        if (!ok) return;

        try{
            await darDeBajaNewsletter(email)
            toast.success("Se ha dado de baja la suscripción correctamente.");
            table.refetch();
        }catch(e){
            console.error(e);
            toast.error(e.message ?? "Ha ocurrido un error al dar de baja la suscripción.");
        }
    }

    return {
        suscriptores: table.data,
        totalCount,
        confirmState: state,
        handleCancel,
        handleConfirm,
        handleDarDeBaja,
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