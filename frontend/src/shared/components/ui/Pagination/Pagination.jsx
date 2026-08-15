import "./Pagination.css"
import { Button } from "../Button/Button"

export function Pagination({ pagination, onPageChange }) {
    if (!pagination) return null

    const { page, totalPages } = pagination

    console.log(pagination)

    return (
        <div className="pagination">
            <Button 
                text={"Anterior"}
                icon={"arrow_back_ios"}
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}/>
            <span>Página {page} de {totalPages}</span>
            <Button
                text={"Siguiente"}
                icon={"arrow_forward_ios"}
                iconPosition={"right"}
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)} />
        </div>
    )
}