// services/ventas.services.js
import { API_URL, handleResponse, authHeaders } from "./http.services";

const buildPaginationParams = ({ page, perPage }) => {
    const params = new URLSearchParams()
    if (page !== undefined) params.set("page", page)
    if (perPage !== undefined) params.set("perPage", perPage)
    const query = params.toString();

    return query;
}

// Público — cualquiera puede finalizar una compra, con o sin cuenta
export const crearVenta = async ({ nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, items }) => {
    const res = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre,
            email,
            telefono,
            direccion_calle,
            direccion_ciudad,
            direccion_provincia,
            direccion_cp,
            items // [{ producto_id, cantidad }]
        })
    });
    return handleResponse(res);
};

// Admin
export const getVentas = async ({ q, estado, page, perPage }) => {
    const params = new URLSearchParams(buildPaginationParams({ page, perPage }))
    if (q) params.set("q", q)
    if (estado) params.set("estado", estado)

    const query = params.toString()
    const res = await fetch(`${API_URL}/ventas${query ? `?${query}` : ""}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const getVentaById = async (id) => {
    const res = await fetch(`${API_URL}/ventas/${id}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const getTotalVentas = async () => {
    const { pagination } = await getVentas({ page: 1, perPage: 1 })
    return pagination.total
}

export const updateEstadoVenta = async ({ id, estado }) => {
    const res = await fetch(`${API_URL}/ventas/${id}/estado`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify({ estado })
    });
    return handleResponse(res);
};

export const cancelarVenta = async (id) => {
    const res = await fetch(`${API_URL}/ventas/${id}/cancelar`, {
        method: "POST",
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const getVentaByCodigo = async (codigo) => {
    const res = await fetch(`${API_URL}/ventas/codigo/${codigo}`);
    return handleResponse(res);
};