import "./DataTable.css"
import { Skeleton } from "../../ui/Skeleton/Skeleton";

function SkeletonRows({ columns, rows = 6 }) {
    return Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={`data__row__table row__table row__table--${columns}`}>
            {Array.from({ length: columns }).map((_, c) => (
                <div key={c}>
                    <Skeleton height="0.9rem" width={c === 0 ? "80%" : "55%"} />
                </div>
            ))}
        </div>
    ))
}

export function DataTable({ 
    data, 
    columns, 
    messageNoSearch, 
    messageNoResults, 
    handleClick, 
    rowClassName, 
    isFiltering,
    isLoading
}) {

    const numberOfColumns = columns?.length;

    return(

        <div className="dashboard__module dashboard__module--table">

                <div className={`header__table row__table row__table row__table--${numberOfColumns}`}>
                    {
                        columns?.map(col => (
                            <div key={col.name}>{col.name}</div>
                        ))
                    }
                </div>


            {
                isLoading?(
                    <SkeletonRows columns = { numberOfColumns } />
                
                ) : data?.length != 0 ? 

                            data?.map(row => (
                                <div key={row.id} className={`data__row__table row__table row__table row__table--${numberOfColumns} ${rowClassName ? rowClassName(row)  : ""}`} onClick={handleClick ? () => handleClick(row.id) : undefined}>
                                    {
                                        columns.map(col => (
                                            <div key={col.key} className={col.className?.(row)}>
                                                {
                                                    col.render 
                                                        ? col.render(row)
                                                        : row[col?.key]?.toString()?.trim() !== "" 
                                                            ? row[col.key] 
                                                            : "-"
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                        ))
                    
                        : (
                            <span className="no__elems__text">
                                {isFiltering
                                    ? (messageNoResults ?? "No se encontraron resultados con ese filtro o búsqueda.")
                                    : messageNoSearch}
                            </span>
                        )
                }

               


            </div>
    )
}