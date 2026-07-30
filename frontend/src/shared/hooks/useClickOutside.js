import { useEffect, useState, useRef } from "react";

export function useClickOutside(){

    const [open, setOpen] = useState(false)
    const ref = useRef()

    useEffect(() => {

        const handleClickOutside = (e) => {
            if(ref.current && !ref.current.contains(e.target)){
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
        
    }, [])

    const toggle = () => setOpen(prev => !prev);
    const close = () => setOpen(false)

    return { open, ref, toggle, close }

}