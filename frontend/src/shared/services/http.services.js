export const API_URL = import.meta.env.VITE_API_URL ?? "https://imponet-new.onrender.com";

console.log(API_URL)

export const getToken = () => localStorage.getItem("token")

export const handleResponse = async (res) => {
    // 204 No Content no tiene body para parsear
    if(res.status === 204) return true;

    const data = await res.json().catch(() => null)

    if (!res.ok) {
        let message = "Error en la petición";

        if (Array.isArray(data?.error)) {
            // Errores de validación de Zod: tomamos el primer mensaje legible
            message = data.error[0]?.message ?? message;
        } else if (typeof data?.error === "string") {
            message = data.error;
        } else if (typeof data?.message === "string") {
            message = data.message;
        }

        throw new Error(message);
    }


    return data;
}

export const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`
})