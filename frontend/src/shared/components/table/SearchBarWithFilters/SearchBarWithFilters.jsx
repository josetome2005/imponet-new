import "./SearchBarWithFilters.css"
import { DropdownFilter } from "../../filters/DropdownFilter/DropdownFilter"


export function SearchBarWithFilters({ search, onSearchChange, activeFilters, filterGroups, onFilterChange, placeholderInput }) {

    return (

        <div className="dashboard__module dashboard__module--searchContainer">

            <label className="search__bar__container">
                <div className="search__bar__img__container">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                </div>
                <input onChange={(e) => onSearchChange(e.target.value)} value={search} type="text" placeholder={placeholderInput} />
            </label>

            {filterGroups?.map(group => (
                <DropdownFilter
                    key={group.field}
                    activeFilter={activeFilters[group.field]}
                    filters={group.options}
                    placeholder={"Todos"}
                    onSelect={(value) => onFilterChange(group.field, value)}
                />
            ))}

        </div>
    )

}