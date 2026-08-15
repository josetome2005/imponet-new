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
        perPage = 10
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


    const refetch = useCallback(async () => {
        setLoading(true)
        try {
            const result = await fetchFn({
                q: search || undefined,
                page,
                perPage,
                ...mappedFilterParams
            })
            setData(result.data)
            setPagination(result.pagination)
        } finally {
            setLoading(false)
        }
    }, [fetchFn, search, page, perPage, mappedFilterParams])

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
        return filterGroups.some(group => activeFilters[group.field] !== defaultActiveFilters[group.field])
    }, [search, filterGroups, activeFilters, defaultActiveFilters])

    return {
        data,
        loading,
        search: searchInput,
        setSearch,
        activeFilters,
        setActiveFilter,
        filterGroups,
        isFiltering,
        pagination,
        setPage,
        refetch
    }

}   