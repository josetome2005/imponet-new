import { getToken, handleResponse, API_URL } from "./http.services";

export const login = async ({email, password}) => {

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password})
    })

    const data = await handleResponse(res)
    localStorage.setItem("token", data.token)
    localStorage.setItem("usuario", JSON.stringify(data.usuario))
    
    return data;
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

export const getMe = async () => {
    const token = getToken();
    if(!token) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if(!res.ok){
        logout();
        return null;
    }

    return res.json();
}

export const getUsuarioActual = () => {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
}

export const isAuthenticated = () => Boolean(getToken());