export const buildPagination = ({ page, perPage, defaultPerPage = 10 }) => {
    const paginar = page !== undefined
    if (!paginar) {
        return { paginar, limitClause: "", limitParams: [], toResult: () => null }
    }

    const pp = Number(perPage) || defaultPerPage
    const offset = (Number(page) - 1) * pp

    return {
        paginar,
        limitClause: "LIMIT ? OFFSET ?",
        limitParams: [pp, offset],
        toResult: (total) => ({
            page: Number(page),
            perPage: pp,
            total,
            totalPages: Math.ceil(total / pp)
        })
    }
}