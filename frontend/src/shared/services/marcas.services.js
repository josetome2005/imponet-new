// services/marcas.js
import { API_URL, handleResponse, authHeaders } from "./http.services.js";

const buildPaginationParams = ({page, perPage}) => {
    const params = new URLSearchParams()
    if (page !== undefined) params.set("page", page)
    if (page !== undefined) params.set("perPage", perPage)
    const query = params.toString();

    return query;
}

export const getMarcas = async ({ page, perPage } = {}) => {
    const query = buildPaginationParams({ page, perPage })
    const res = await fetch(`${API_URL}/marcas${query ? `?${query}` : ""}`);
    return handleResponse(res);
};

export const getMarcaById = async (id) => {
    const res = await fetch(`${API_URL}/marcas/${id}`);
    return handleResponse(res);
};

export const createMarca = async ({ nombre, slug }) => {
    const res = await fetch(`${API_URL}/marcas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre, slug })
    });
    return handleResponse(res);
};

export const updateMarca = async ({ id, nombre, slug }) => {
    const res = await fetch(`${API_URL}/marcas/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre, slug })
    });
    return handleResponse(res);
};

export const deleteMarca = async (id) => {
    const res = await fetch(`${API_URL}/marcas/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const getMarcasConCantidad = async ({ page, perPage } = {}) => {
    const query = buildPaginationParams({ page, perPage })
    const res = await fetch(`${API_URL}/marcas/con-cantidad${query ? `?${query}` : ""}`);
    return handleResponse(res);
};