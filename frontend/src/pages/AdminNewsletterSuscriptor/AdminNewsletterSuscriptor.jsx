import "./AdminNewsletterSuscriptor.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { useEffect, useState } from "react"
import { useAdminCRUD } from "../../shared/hooks/useAdminCRUD"
import { EditForm } from "../../shared/components/forms/EditForm/EditForm"
import { ConfirmModal } from "../../shared/components/modals/ConfirmModal/ConfirmModal"
import { useNewsletterCRUD } from "../../shared/hooks/useNewsletterCRUD"
import { buildNewsletterColumns, filters } from "./data/newsletter.config"

export function AdminNewsletterSuscriptor(){
    
    const {
        suscriptores,
        totalCount,
        confirmState,
        handleCancel,
        handleConfirm,
        handleDarDeBaja,
        search,
        setSearch,
        activeFilters,
        setActiveFilter,
        filterGroups,
        isFiltering,
        pagination,
        setPage,
    } = useNewsletterCRUD({ filters })

    const columns = buildNewsletterColumns({onDarDeBaja: handleDarDeBaja})

    return(

        <div className="admin__section admin__newsletter">

            <SectionTitle 
                title={"Suscripcciones"}
                subtitle={"Gestiona las suscripciones de tu tienda."}
            />

            <TableContainer
                data={suscriptores}
                columns={columns}
                messageNoSearch={"No tienes suscripciones registradas aún."}
                placeholderInput={"Buscar por email "}

                search={search}
                onSearchChange={setSearch}

                activeFilters={activeFilters}
                onFilterChange={setActiveFilter}
                filterGroups={filterGroups}

                pagination={pagination}
                onPageChange={setPage}

                isFiltering={isFiltering}
            />  

            {
                confirmState &&
                <ConfirmModal
                    message={confirmState.message}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}/>
            }

        </div>

    )

}