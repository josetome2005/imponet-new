// services/marcas.js
import { API_URL, handleResponse, authHeaders } from "./http.services.js";

export const getMarcas = async () => {
    const res = await fetch(`${API_URL}/marcas`);
    return handleResponse(res);
};

export const getMarcaById = async (id) => {
    const res = await fetch(`${API_URL}/marcas/${id}`);
    return handleResponse(res);
};

export const createMarca = async ({ nombre }) => {
    const res = await fetch(`${API_URL}/marcas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre })
    });
    return handleResponse(res);
};

export const updateMarca = async ({ id, nombre }) => {
    const res = await fetch(`${API_URL}/marcas/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ nombre })
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

export const getMarcasConCantidad = async () => {
    const res = await fetch(`${API_URL}/marcas/con-cantidad`);
    return handleResponse(res);
};