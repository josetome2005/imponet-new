import "./FilterGroup.css"
import { useMemo, useState } from "react";

export function FilterGroup({ title, items, selectedSlugs, onSelect, onRemove, searchable = true }){

    const [search, setSearch] = useState("")

    const filteredItems = useMemo(() => {
        if(!search.trim()) return items;
        const term = search.toLocaleLowerCase()
        return items.filter((i) => i.nombre.toLocaleLowerCase().includes(term))
    }, [search, items])

    const selectedItems = useMemo(() => {
        if(selectedSlugs.length === 0) return;
        return filteredItems.filter(i => selectedSlugs?.includes(i.slug))
    }, [selectedSlugs, filteredItems])

    const nonSelectedItems = useMemo(() => {
        return filteredItems.filter(i => !selectedSlugs?.includes(i.slug))
    }, [selectedSlugs, filteredItems])

    return(
        <div className="filter__group">
            <h4>{title}</h4>

            <div className="selected__items__container">
                {
                    selectedItems?.length > 0 &&
                    selectedItems.map((i) => (
                        <span className="selected__item">
                            {i.nombre}
                            <span className="material-symbols-outlined" onClick={() => onRemove(i.slug)}>close</span>
                        </span>
                    ))
                }
            </div>

            {
                searchable && items.length > 3 && (
                    <input 
                        type="text"
                        className="filter__search"
                        placeholder={`Buscar ${title.toLocaleLowerCase()}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                )
            }

            <div className="filter__options">
                {
                    nonSelectedItems?.map((item) => (
                        <span 
                            key={item.id} 
                            className={`${selectedSlugs.includes(item.slug) ? "activo" : "inactivo" }`} 
                            onClick={() => onSelect(item.slug)}
                        >
                            {item.nombre} ({item.cantidad_productos})
                        </span>
                    ))
                }
                {
                    filteredItems.length === 0 && (
                        <span className="filter__empty">Sin resultados</span>
                    )
                }
            </div>

        </div>

    )
    
}