import "./Pagination.css"
import { Button } from "../Button/Button"
import { Skeleton } from "../Skeleton/Skeleton"

export function Pagination({ pagination, onPageChange, isLoading }) {
    if (!pagination || pagination.totalPages <= 1) return null

    const { page, totalPages } = pagination

    return (
        <div className="pagination">
            {
                isLoading 
                ?
                    <>
                        <Skeleton width="150px" height="40px"/>
                        <Skeleton width="100px" height="40px"/>
                        <Skeleton width="150px" height="40px"/>
                    </>
                :
                    <>
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
                    </>
            }

        </div>        
    )
}