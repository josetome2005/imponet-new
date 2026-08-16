// services/categorias.js
import { API_URL, handleResponse, authHeaders } from "./http.services.js";

const buildPaginationParams = ({ page, perPage }) => {
    const params = new URLSearchParams()
    if (page !== undefined) params.set("page", page)
    if (page !== undefined) params.set("perPage", perPage)
    const query = params.toString();

    return query;
}

export const getCategorias = async ({ page, perPage, destacado, q } = {}) => {
    const params = new URLSearchParams(buildPaginationParams({ page, perPage }))
    if (destacado !== undefined) params.set("destacado", destacado)
    if (q) params.set("q", q)
    
    const query = params.toString()
    const res = await fetch(`${API_URL}/categorias${query ? `?${query}` : ""}`);
    return handleResponse(res);
};


export const getCategoriaById = async (id) => {
    const res = await fetch(`${API_URL}/categorias/${id}`);
    return handleResponse(res);
};

export const createCategoria = async ({ nombre, slug }) => {
    const res = await fetch(`${API_URL}/categorias`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre, slug })
    });
    return handleResponse(res);
};

export const updateCategoria = async ({ id, nombre, slug }) => {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre, slug })
    });
    return handleResponse(res);
};

export const deleteCategoria = async (id) => {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const getCategoriasConCantidad = async ({ page, perPage, destacado, q } = {}) => {
    const params = new URLSearchParams(buildPaginationParams({ page, perPage }))
    if (destacado !== undefined) params.set("destacado", destacado)
    if (q) params.set("q", q)

    const query = params.toString()
    const res = await fetch(`${API_URL}/categorias/con-cantidad${query ? `?${query}` : ""}`);
    return handleResponse(res);
};

export const getCategoriasDestacadas = async () => {
    const res = await fetch(`${API_URL}/categorias/destacadas`);
    return handleResponse(res);
};