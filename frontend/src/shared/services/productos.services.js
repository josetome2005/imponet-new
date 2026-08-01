import { API_URL, handleResponse, getToken, authHeaders } from "./http.services";

export const getProductos = async () => {
    const res = await fetch(`${API_URL}/productos`);
    return handleResponse(res);
};

export const getProductoById = async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`);
    return handleResponse(res);
};

export const getProductosAdmin = async () => {
    const res = await fetch(`${API_URL}/productos/admin/all`, {
        headers: authHeaders()
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

export const updateProducto = async ({ id, object, imagenes = [] }) => {

    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "categoria_ids" && Array.isArray(value)) {
            formData.append(key, value.join(","))
        } else {
            formData.append(key, value)
        }
    })

    imagenes.forEach((file) => formData.append("imagenes", file))

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
