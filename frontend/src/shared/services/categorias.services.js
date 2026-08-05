// services/categorias.js
import { API_URL, handleResponse, authHeaders } from "./http.services.js";

export const getCategorias = async () => {
    const res = await fetch(`${API_URL}/categorias`);
    return handleResponse(res);
};

export const getCategoriaById = async (id) => {
    const res = await fetch(`${API_URL}/categorias/${id}`);
    return handleResponse(res);
};

export const createCategoria = async ({ nombre }) => {
    const res = await fetch(`${API_URL}/categorias`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre })
    });
    return handleResponse(res);
};

export const updateCategoria = async ({ id, nombre }) => {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre })
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

export const getCategoriasConCantidad = async () => {
    const res = await fetch(`${API_URL}/categorias/con-cantidad`);
    return handleResponse(res);
};