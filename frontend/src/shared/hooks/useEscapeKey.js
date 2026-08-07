import { useEffect } from "react";

export function useEscapeKey(onEscape){

    useEffect(() => {

        const handleKeyDown = (e) => {
            if(e.key === "Escape") onEscape(e)
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }

    }, [onEscape])

}