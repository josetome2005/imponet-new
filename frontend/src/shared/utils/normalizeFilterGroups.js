export function normalizeFilterGroups(filters){
    if(!filters?.length) return [];

    const isGrouped = filters[0]?.options !== undefined;

    if(isGrouped) return filters;

    // Formato viejo (un solo filtro): se interpreta como un único grupo "state"
    return [{field: "state", options: filters}]
}

