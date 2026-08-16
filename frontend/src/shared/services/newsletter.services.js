import { handleResponse, API_URL, authHeaders } from "./http.services"

const buildPaginationParams = ({page, perPage}) => {
    const params = new URLSearchParams()
    if (page !== undefined) params.set("page", page)
    if (page !== undefined) params.set("perPage", perPage)
    const query = params.toString();

    return query;
}

export const suscribirNewsletter = async (email) => {
    const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    return handleResponse(res);
};

export const getNewsletterSuscriptores = async ({page, perPage, q, activo} = {}) => {
    const params = new URLSearchParams(buildPaginationParams({page, perPage}))
    if(q) params.set("q", params)
    if(activo !== undefined) params.set("activo", activo)

    const query = params.toString()

    const res = await fetch(`${API_URL}/newsletter${query ? `?${query}` : ""}`,{
        headers: authHeaders()
    });
    return handleResponse(res);
}

export const darDeBajaNewsletter = async (email) => {
    const res = await fetch(
        `${API_URL}/newsletter/${encodeURIComponent(email)}`,
        {
            method: "PATCH",
            headers: authHeaders()
        }
    )
    return handleResponse(res)
}

