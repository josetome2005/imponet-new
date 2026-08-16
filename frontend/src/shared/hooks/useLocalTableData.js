import { useState, useMemo, useEffect } from "react"
import { normalizeFilterGroups } from "../utils/normalizeFilterGroups"

export function useLocalTableData(data, { searchFields = [], filters, initialFilter = "todos", tabs, initialTab, perPage = 12 } = {}) {

    const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const filterGroups = useMemo(() => normalizeFilterGroups(filters), [filters])

    const [search, setSearch] = useState("")
    const [activeFilters, setActiveFiltersState] = useState(() => {
        const initial = {}
        filterGroups.forEach(group => {
            initial[group.field] = initialFilter ?? group.options[0]?.filter
        })
        return initial
    })
    const [activeTab, setActiveTabState] = useState(initialTab ?? tabs?.[0]?.key ?? null)
    const [page, setPage] = useState(1)

    const normalizedSearch = useMemo(() => removeAccents(search.toLowerCase().trim()), [search])

    const setActiveFilter = (fieldOrValue, value) => {
        if (value === undefined) {
            if (filterGroups.length !== 1) return
            setActiveFiltersState(prev => ({ ...prev, [filterGroups[0].field]: fieldOrValue }))
        } else {
            setActiveFiltersState(prev => ({ ...prev, [fieldOrValue]: value }))
        }
    }

    const setActiveTab = (tabKey) => setActiveTabState(tabKey)

    const defaultActiveFilters = useMemo(() => {
        const initial = {}
        filterGroups.forEach(group => {
            initial[group.field] = initialFilter ?? group.options[0]?.filter
        })
        return initial
    }, [filterGroups, initialFilter])

    // Reset a página 1 cada vez que cambia algo que afecta el resultado
    useEffect(() => {
        setPage(1)
    }, [normalizedSearch, activeFilters, activeTab])

    const filteredData = useMemo(() => {
        let result = data

        if (tabs?.length && activeTab) {
            const tab = tabs.find(t => t.key === activeTab)
            if (tab?.filterFn) result = result.filter(tab.filterFn)
        }

        if (normalizedSearch) {
            result = result.filter(item =>
                searchFields.some(field => {
                    const rawValue = item[field]
                    if (rawValue == null) return false

                    if (field === "phone" || field === "number") {
                        const value = String(rawValue).replaceAll(" ", "")
                        return value.includes(normalizedSearch.replaceAll(" ", ""))
                    }

                    const value = removeAccents(String(rawValue).toLowerCase())
                    return value.includes(normalizedSearch)
                })
            )
        }

        filterGroups.forEach(group => {
            const activeKey = activeFilters[group.field]
            const active = group.options.find(f => f.filter === activeKey)
            if (active?.filterResult !== undefined && active?.filterResult !== null) {
                result = result.filter(item => String(item[group.field]) === String(active.filterResult))
            }
        })

        return result
    }, [data, searchFields, normalizedSearch, filterGroups, activeFilters, tabs, activeTab])

    const paginatedData = useMemo(() => {
        const start = (page - 1) * perPage
        return filteredData?.items?.slice(start, start + perPage)
    }, [filteredData, page, perPage])

    const pagination = useMemo(() => ({
        page,
        perPage,
        total: filteredData.items.length,
        totalPages: Math.ceil(filteredData.items.length / perPage)
    }), [filteredData.length, page, perPage])

    const isFiltering = useMemo(() => {
        if (normalizedSearch) return true
        if (filterGroups.some(group => activeFilters[group.field] !== defaultActiveFilters[group.field])) return true
        if (tabs?.length && activeTab !== (initialTab ?? tabs[0]?.key)) return true
        return false
    }, [normalizedSearch, filterGroups, activeFilters, defaultActiveFilters, tabs, activeTab, initialTab])

    return {
        data: paginatedData,
        loading: false,
        search,
        setSearch,
        activeFilters,
        setActiveFilter,
        filterGroups,
        activeTab,
        setActiveTab,
        isFiltering,
        pagination,
        setPage,
        refetch: () => {} // no-op, no hay nada que refetchear desde el servidor
    }
}