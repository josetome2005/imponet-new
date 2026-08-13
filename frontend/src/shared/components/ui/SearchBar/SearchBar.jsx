import "./SearchBar.css"
import { useState } from "react";
import { useSearchProductos } from "../../../hooks/useSearchProductos"
import { useNavigate } from "react-router-dom"

export function SearchBar(){

    const [query, setQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const { results, loading } = useSearchProductos(query, {limit: 5})
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!query.trim()) return;
        setShowDropdown(false);
        navigate(`/productos?q=${encodeURIComponent(query.trim())}`)
    }

    return(
        <div className="searchbar__container">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Buscar por modelo, ej: Notebook Lenovo 15"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    //onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />  
                <button type="submit">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </form>

            {
                showDropdown && query.trim().length >= 2 &&
                <div className="search__dropdown">
                    {loading && <span className="search__loading">Buscando...</span>}

                    {!loading && results.length === 0 && (
                        <span className="search__empty">Sin resultados para "{query}"</span>
                    )}

                    {!loading && results.map((p) => (
                        <div
                            key={p.id}
                            className="search__result__item"
                            onMouseDown={() => navigate(`/producto/${p.id}`)}
                        >
                            <span>{p.nombre}</span>
                            <span className="search__result__precio">${p.precio}</span>
                        </div>
                    ))}

                    {!loading && results.length > 0 && (
                        <button
                            className="search__ver__todos"
                            onMouseDown={handleSubmit}
                        >
                            Ver todos los resultados para "{query}"
                        </button>
                    )}
                </div>
            }


        </div>

    )


}