import {useMemo, useState} from "react"

export function useTableFilters(data, searchFields, filters, initialFilter, tabs, activeTab){

    const [search, setSearch] = useState("")

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const normalizedSearch = useMemo(() => {
        return removeAccents(search.toLowerCase().trim());
    }, [search]);

    /**
     * Normaliza "filters" a un array de grupos: [{ field, options: [...] }]
     *
     * - Formato nuevo (varios filtros, ej. Propiedades):
     *     [{ field: "state", options: [...] }, { field: "operation_type", options: [...] }]
     *
     * - Formato viejo (un solo filtro, ej. Tareas):
     *     [{ filter, filterResult, label }, ...]
     *   se interpreta como un único grupo que filtra por "state"
     */
    const filterGroups = useMemo(() => {

        if(!filters?.length) return [];

        const isGrouped = filters[0]?.options !== undefined;

        if(isGrouped) return filters;

        return [{field: "state", options: filters}]

    }, [filters])

    const [activeFilters, setActiveFilters] = useState(() => {
        const initial = {};
        filterGroups.forEach(group => {
            initial[group.field] = initialFilter ?? group.options[0]?.filter
        })
        return initial;
    })

    // Guardamos cuáles son los valores "por defecto" de cada grupo de filtros para luego poder saber si hubo cambio
    const defaultActiveFilters = useMemo(() => {
        const initial = {};
        filterGroups.forEach(group => {
            initial[group.field] = initialFilter ?? group.options[0]?.filter
        })
        return initial;
    }, [filterGroups, initialFilter])

    // true si hay búsqueda de texto, algún filtro distinto al default, O un tab distinto al inicial
    const isFiltering = useMemo(() => {
        if (normalizedSearch) return true;

        const filterChanged = filterGroups.some(
            group => activeFilters[group.field] !== defaultActiveFilters[group.field]
        );
        if (filterChanged) return true;

        const tabChanged = tabs?.length > 0 && activeTab !== tabs[0]?.key;
        if (tabChanged) return true;

        return false;
    }, [normalizedSearch, filterGroups, activeFilters, defaultActiveFilters, tabs, activeTab])

    const setActiveFilter = (fieldOrValue, value) => {
        if(value === undefined){
            if(filterGroups.length !== 1) return
            setActiveFilters(prev => ({...prev, [filterGroups[0].field]: fieldOrValue}))
            return
        }
        setActiveFilters(prev => ({...prev, [fieldOrValue]: value}))
    }


    const filteredData = useMemo(() => {

        let result = data;

        // Tabs (si existen)
        if(tabs?.length && activeTab){
            const tab = tabs.find(t => t.key === activeTab);
                if (tab?.filterFn) {
                result = result.filter(tab.filterFn);
            }

        }

        if(normalizedSearch){

            result = result.filter(item => {

                if(!normalizedSearch) return true
                
                return searchFields.some(field => {

                    const rawValue = item[field]

                    if(rawValue == null) return false

                    // Teléfono / números
                    if(field == "phone" || field == "number"){
                        const value = String(rawValue).replaceAll(" ", "");
                        return value.includes(normalizedSearch.replaceAll(" ", ""))
                    }

                    // Texto normal
                    const value = removeAccents(
                        String(rawValue).toLowerCase()
                    )

                    return value.includes(normalizedSearch)

                });

            })

        }

        //DropDown Filters.
        filterGroups.forEach(group => {

            const activeKey = activeFilters[group.field]
            const active = group.options.find(f => f.filter === activeKey)

            if(active?.filterResult !== undefined && active?.filterResult !== null){
                result = result.filter(item => String(item[group.field]) === String(active.filterResult))
            }
        })

        return result;

    }, [
        data,
        searchFields,
        normalizedSearch,
        filterGroups,
        activeFilters,
        tabs,
        activeTab
    ])


    return{
        search,
        setSearch,
        activeFilters,
        setActiveFilter,
        filteredData,
        filterGroups,
        isFiltering
    }

}