/**
 * ToastContainer
 * -------------------------------
 * Posiciona el stack de toasts en una esquina de la pantalla
 * `position` acepta: "bottom-right" | "bottom-left" | "top-right" | "top-left"
 */

import ToastItem from "./ToastItem";
import "./Toast.css";

export default function ToastContainer({toasts, onDismiss, position="bottom-right"}){

    return(
        <div className={`toast-container toast-container--${position}`}>
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    )

}