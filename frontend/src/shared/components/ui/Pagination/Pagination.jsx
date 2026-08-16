import "./Pagination.css"
import { Button } from "../Button/Button"

export function Pagination({ pagination, onPageChange }) {
    if (!pagination || pagination.totalPages <= 1) return null

    const { page, totalPages } = pagination

    return (
        <div className="pagination">
            {
                totalPages > 1 && 
                <Button 
                text={"Anterior"}
                icon={"arrow_back_ios"}
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}/>
            }
            <span>Página {page} de {totalPages}</span>
            {
                totalPages > 1 && 
                <Button
                text={"Siguiente"}
                icon={"arrow_forward_ios"}
                iconPosition={"right"}
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)} />
            }
        </div>
    )
}