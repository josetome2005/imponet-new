/**
 * ToastItem
 * ---------
 * Un toast individual
 */

import { useCallback, useEffect, useState, useRef } from "react"

const ICONS = {
    success: "check_circle",
    error: "cancel",
    warning: "warning",
    info: "info"
}

export default function ToastItem({toast, onDismiss}){

    const {id, type = "info", title, message, duration = 4000 } = toast
    const [isLeaving, setIsLeaving] = useState(false)
    const timerRef = useRef(null)
    const Icon = ICONS[type] || "info"

    const handleDismiss = useCallback(() => {
        setIsLeaving(true)
        setTimeout(() => onDismiss(id), 220)
    }, [id, onDismiss])

    useEffect(() => {
        if(duration === Infinity) return;
        timerRef.current = setTimeout(handleDismiss, duration)
        return () => clearTimeout(timerRef.current)
    }, [duration, handleDismiss])

    const pauseTimer = () => clearTimeout(timerRef.current)
    const resumeTimer = () => {
        if(duration !== Infinity){
            timerRef.current = setTimeout(handleDismiss, 1200)
        }
    }

    return(
        <div 
            role="status"
            aria-live="polite"
            className={`toast toast--${type} ${isLeaving ? "toast--leaving" : "toast--entering"}`}
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
        >
            <span className="toast__accent" />
            <span className="material-symbols-outlined toast__icon" aria-hidden="true">
                {Icon}
            </span>

            <div className="toast__body">
                {title && <div className="toast__title">{title}</div> }
                <div className="toast__message">{message}</div>
            </div>

            <button
                type="button"
                className="toast__close"
                aria-label="Cerrar notificación"    
                onClick={handleDismiss}
            >   
                <span className="material-symbols-outlined">
                    close
                </span>
            </button>

            {
                duration !== Infinity && !isLeaving && (
                    <span
                        className="toast__progress"
                        style={{animationDuration: `${duration}ms`}}
                    >   

                    </span>
                )
            }
        </div>
    )

}

