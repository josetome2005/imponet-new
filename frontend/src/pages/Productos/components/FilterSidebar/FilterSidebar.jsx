import "./FilterSidebar.css"
import { useState } from "react";
import { FilterGroup } from "../FilterGroup/FilterGroup";

export function FiltersSidebar({ marcas, categorias, initialFilters, onApply, onClean }){

    const [selectedMarcas, setSelectedMarcas] = useState(initialFilters?.marca ?? []);
    const [selectedCategorias, setSelectedCategorias] = useState(initialFilters?.categoria ?? []);
    const [precioMin, setPrecioMin] = useState(initialFilters?.precioMin ?? "");
    const [precioMax, setPrecioMax] = useState(initialFilters?.precioMax ?? "");

    const applyWith = (overrides) => {
        onApply({
            marca: selectedMarcas,
            categoria: selectedCategorias,
            precioMin: precioMin || undefined,
            precioMax: precioMax || undefined,
            ...overrides
        });
    };

    const selectMarca = (slug) => {
        const updated = [...selectedMarcas, slug];
        setSelectedMarcas(updated);
        applyWith({ marca: updated });
    }

    const removeMarca = (slug) => {
        const updated = selectedMarcas.filter((m) => m !== slug);
        setSelectedMarcas(updated);
        applyWith({ marca: updated });
    }

    const selectCategoria = (slug) => {
        const updated = [...selectedCategorias, slug];
        setSelectedCategorias(updated);
        applyWith({ categoria: updated });
    }

    const removeCategoria = (slug) => {
        const updated = selectedCategorias.filter((c) => c !== slug);
        setSelectedCategorias(updated);
        applyWith({ categoria: updated });
    }

    const handleAplicar = () => {
        applyWith({})
    };

    const handleClean = () => {
        setPrecioMax("")
        setPrecioMin("")
        setSelectedCategorias([])
        setSelectedMarcas([])
        onClean()
    }

    return (
        <aside className="filters__sidebar">

            <FilterGroup
                title="Marcas"
                items={marcas}
                selectedSlugs={selectedMarcas}
                onSelect={selectMarca}
                onRemove={removeMarca}
            />

            <hr />

            <FilterGroup
                title="Categorías"
                items={categorias}
                selectedSlugs={selectedCategorias}
                onSelect={selectCategoria}
                onRemove={removeCategoria}
            />

            <hr />

            <div className="filter__group">
                <h4>Precio</h4>
                <label className="filter__price__label">Mínimo</label>
                <input
                    type="number"
                    className="filter__price__input"
                    placeholder="$0"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                />
                <label className="filter__price__label">Máximo</label>
                <input
                    type="number"
                    className="filter__price__input"
                    placeholder="Sin límite"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                />
            </div>

            <button className="filter__sidebar__button filter__apply__btn" onClick={handleAplicar}>
                Aplicar
            </button>
            <button className="filter__sidebar__button filter__clean__btn" onClick={handleClean}>
                Limpiar Filtros
            </button>
        </aside>
    );


}