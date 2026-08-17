import { API_URL, handleResponse, authHeaders } from "./http.services";

export const getProductos = async () => {
    const res = await fetch(`${API_URL}/productos`);
    return handleResponse(res);
};

export const getProductoById = async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`);
    return handleResponse(res);
};

export const searchProductos = async ({ q, marca, categoria, precioMin, precioMax, activo, destacado, con_descuento, orden, page, perPage } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (marca?.length) params.set("marca", Array.isArray(marca) ? marca.join(",") : marca);
    if (categoria?.length) params.set("categoria", Array.isArray(categoria) ? categoria.join(",") : categoria);
    if (precioMin) params.set("precioMin", precioMin);
    if (precioMax) params.set("precioMax", precioMax);
    if (activo !== undefined) params.set("activo", activo);
    if (destacado !== undefined) params.set("destacado", destacado);
    if (con_descuento !== undefined) params.set("con_descuento", con_descuento);
    if (orden) params.set("orden", orden);
    if (page) params.set("page", page);
    if (perPage) params.set("perPage", perPage);

    const res = await fetch(`${API_URL}/productos/buscar?${params}`);
    return handleResponse(res);
};

// Wrappers finitos, por compatibilidad con quien ya los use — delegan a searchProductos
export const getProductosDestacados = async () => searchProductos({ activo: true, destacado: true, perPage: 8 });
export const getProductosEnOferta = async () => searchProductos({ activo: true, con_descuento: true, perPage: 6 });

export const getTotalProductos = async () => {
    const res = await fetch(`${API_URL}/productos/count`,{
        headers: authHeaders()
    });
    return handleResponse(res);
}

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

