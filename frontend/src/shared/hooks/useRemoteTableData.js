import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { normalizeFilterGroups } from "../utils/normalizeFilterGroups";

/**
 * Maneja búsqueda + filtros dropdown + paginación cuando los datos
 * viven en el servidor (fetchFn hace la query real).
 *
 * fetchFn: (queryParams) => Promise<{ data, pagination }>
 *   queryParams = { q, page, perPage, ...filtrosMapeados }
 */

export function useRemoteTableData(
    fetchFn,
    {
        filters, 
        initialFilter = "todos",
        perPage = 10,
        tabs,
        initialTab
    } = {}
){

    const filterGroups = useMemo(() => normalizeFilterGroups(filters), [filters])

    const [searchInput, setSearchInput] = useState("")  // version del usuario para escibir
    const [search, setSearchDebounced] = useState("")   // version deboundceada
    const [activeFilters, setActiveFilters] = useState(() => {
        const initial = {}
        filterGroups.forEach(group => {
            initial[group.field] = initialFilter ?? group.options[0]?.filter
        })
        return initial
    })

    const [activeTab, setActiveTabRaw] = useState(initialTab ?? tabs?.[0]?.key ?? null)

    const [page, setPage] = useState(1)

    const [data, setData] = useState([])
    const [pagination, setPagination] = useState(null)
    const [loading, setLoading] = useState(false)

    const debounceRef = useRef(null)

    // Debounce del texto de búsqueda: espera antes de disparar el fetch real
    const setSearch = (value) => {
        setSearchInput(value)
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setSearchDebounced(value)
            setPage(1)
        }, 350)
    }

    const setActiveFilter = (fieldOrValue, value) => {
        if (value === undefined) {
            if (filterGroups.length !== 1) return
            setActiveFilters(prev => ({ ...prev, [filterGroups[0].field]: fieldOrValue }))
        } else {
            setActiveFilters(prev => ({ ...prev, [fieldOrValue]: value }))
        }
        setPage(1)
    }

    const setActiveTab = (tabKey) => {
        setActiveTabRaw(tabKey)
        setPage(1)
    }

    // Traduce los filtros seleccionados (ej: "activo") a los valores reales
    // que espera el backend (ej: { activo: 1 })
    const mappedFilterParams = useMemo(() => {
        const params = {}
        filterGroups.forEach(group => {
            const activeKey = activeFilters[group.field]
            const active = group.options.find(f => f.filter === activeKey)
            if (active?.filterResult !== undefined && active?.filterResult !== null) {
                params[group.field] = active.filterResult
            }
        })
        return params
    }, [filterGroups, activeFilters])


    // El tab activo se traduce a params vía su propia función (definida por quien arma "tabs")
    const mappedTabParams = useMemo(() => {
        if (!tabs?.length || !activeTab) return {}
        const tab = tabs.find(t => t.key === activeTab)
        return tab?.toParams?.() ?? {}
    }, [tabs, activeTab])

    const refetch = useCallback(async () => {
        setLoading(true)
        try {
            const result = await fetchFn({
                q: search || undefined,
                page,
                perPage,
                ...mappedFilterParams,
                ...mappedTabParams
            })
            setData(result.data)
            setPagination(result.pagination)
        } finally {
            setLoading(false)
        }
    }, [fetchFn, search, page, perPage, mappedFilterParams, mappedTabParams])

    useEffect(() => {
        refetch()
    }, [refetch])

    const defaultActiveFilters = useMemo(() => {
        const initial = {}
        filterGroups.forEach(group => {
            initial[group.field] = initialFilter ?? group.options[0]?.filter
        })
        return initial
    }, [filterGroups, initialFilter])

    const isFiltering = useMemo(() => {
        if (search) return true

        const filtersChange = filterGroups.some(group => activeFilters[group.field] !== defaultActiveFilters[group.field])
        if(filtersChange) return true

        const tabChanged = tabs?.length > 0 && activeTab !== tabs[0]?.key;
        if (tabChanged) return true;

        return false;
    }, [search, filterGroups, activeFilters, defaultActiveFilters, tabs, activeTab])

    return {
        data,
        loading,
        search: searchInput,
        setSearch,
        activeFilters,
        setActiveFilter,
        filterGroups,
        activeTab,
        setActiveTab,
        isFiltering,
        pagination,
        setPage,
        refetch
    }

}   