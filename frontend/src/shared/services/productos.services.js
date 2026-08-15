import { API_URL, handleResponse, authHeaders } from "./http.services";

export const getProductos = async () => {
    const res = await fetch(`${API_URL}/productos`);
    return handleResponse(res);
};

export const getProductoById = async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`);
    return handleResponse(res);
};

export const getProductosAdmin = async ({ activo, destacado, conDescuento, page, perPage }) => {
    const params = new URLSearchParams();
    if (activo !== undefined) params.set("activo", activo);
    if (destacado !== undefined) params.set("destacado", destacado);
    if (conDescuento !== undefined) params.set("conDescuento", conDescuento);
    if (page) params.set("page", page);
    if (perPage) params.set("perPage", perPage);

    const query = params.toString();
    const res = await fetch(`${API_URL}/productos/admin/all${query ? `?${query}` : ""}`, {
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const getProductosDestacados = async () => {
    const res = await fetch(`${API_URL}/productos?destacado=true&limit=8`);
    return handleResponse(res);
};

export const getProductosEnOferta = async () => {
    const res = await fetch(`${API_URL}/productos?con_descuento=true&limit=6`);
    return handleResponse(res);
};

export const getProductosPorIds = async (ids) => {
    const res = await fetch(`${API_URL}/productos/por-ids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
    });
    return handleResponse(res);
};

export const createProducto = async({object, imagenes = []}) => {

    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if(value === undefined || value === null) return;
        if(key === "categoria_ids" && Array.isArray(value)){
            formData.append(key, value.join(","))
        }else{
            formData.append(key, value)
        }
    })

    imagenes.forEach((file) => formData.append("imagenes", file))

    const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: authHeaders(),
        body: formData
    })

    return handleResponse(res);

}

// object: campos básicos { nombre, precio, ... }
// imagenesOrden: array de strings ("url existente" o "NEW") en el orden final
// archivosNuevos: array de File, en el mismo orden que aparecen los "NEW" en imagenesOrden
export const updateProducto = async ({ id, object, imagenesOrden, archivosNuevos = [] }) => {

    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "categoria_ids" && Array.isArray(value)) {
            formData.append(key, value.join(","))
        } else {
            formData.append(key, value)
        }
    })

    if (imagenesOrden) {
        formData.append("imagenes_orden", JSON.stringify(imagenesOrden));
    }
    archivosNuevos.forEach((file) => formData.append("imagenes", file));
    const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: formData
    })

    return handleResponse(res);

}

export const deleteProducto = async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(res);
};

export const searchProductos = async ({ q, marca, categoria, precioMin, precioMax, orden, page, perPage } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (marca?.length) params.set("marca", Array.isArray(marca) ? marca.join(",") : marca);
    if (categoria?.length) params.set("categoria", Array.isArray(categoria) ? categoria.join(",") : categoria);
    if (precioMin) params.set("precioMin", precioMin);
    if (precioMax) params.set("precioMax", precioMax);
    if (orden) params.set("orden", orden);
    if (page) params.set("page", page);
    if (perPage) params.set("perPage", perPage);

    const res = await fetch(`${API_URL}/productos/buscar?${params}`);
    return handleResponse(res);
};