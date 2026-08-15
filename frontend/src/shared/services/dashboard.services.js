import { API_URL, handleResponse, authHeaders } from "./http.services";

export const getDashboardResumen = async () => {
    const res = await fetch(`${API_URL}/dashboard/resumen`, {
        headers: authHeaders()
    });
    return handleResponse(res);
};