/**
 * Toast Context
 * ------------------------
 * Guarda la lista de toasts activos y expone las funciones para
 * dispararlos (show, success, error, warning, info) y para cerrarlos 
*/

import { createContext, useCallback, useContext, useState } from "react";
import ToastContainer from "./ToastContainer";

const ToastContext = createContext(null)

let idCounter = 0;

export function ToastProvider({children, position = "bottom-right"}){

    const [toast, setToasts] = useState([])

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const show = useCallback(({ type = "info", message, title, duration = 4000}) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, {id, type, message, title, duration}])
        return id;
    }, []) 

    const api = {
        show,
        success: (message, opts = {}) => show({...opts, type: "success", message}),
        error: (message, opts = {}) => show({ ...opts, type: "error", message }),
        warning: (message, opts = {}) => show({ ...opts, type: "warning", message }),
        info: (message, opts = {}) => show({ ...opts, type: "info", message }),
        dismiss
    }

    return (
        <ToastContext.Provider value={api}>
            {children}
            <ToastContainer toasts={toast} onDismiss={dismiss} position={position} />
        </ToastContext.Provider>
    )

}

export function useToast(){
    const ctx = useContext(ToastContext)
    if (!ctx) {
        throw new Error("useToast debe usarse dentro de un <ToastProvider>");
    }
    return ctx;
}