import { useEffect, useRef } from "react"

export function useDragScroll(itemWidth) {
    const containerRef = useRef()

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        let isDown = false
        let startX
        let scrollLeft

        // ancho de UN set completo (para saber cuánto "saltar")
        const getSetWidth = () => el.scrollWidth / 3

        // posicionamos al inicio en el set del medio
        el.scrollLeft = getSetWidth()

        const checkLoop = () => {
            const setWidth = getSetWidth()

            if (el.scrollLeft <= 0) {
                el.scrollLeft += setWidth
                if (isDown) scrollLeft += setWidth // <-- clave
            } else if (el.scrollLeft >= setWidth * 2) {
                el.scrollLeft -= setWidth
                if (isDown) scrollLeft -= setWidth // <-- clave
            }
        }

        const onMouseDown = (e) => {
            isDown = true
            el.classList.add("dragging")
            startX = e.pageX - el.offsetLeft
            scrollLeft = el.scrollLeft
        }
        const onMouseLeave = () => { isDown = false; el.classList.remove("dragging") }
        const onMouseUp = () => { isDown = false; el.classList.remove("dragging") }
        const onMouseMove = (e) => {
            if (!isDown) return
            e.preventDefault()
            const x = e.pageX - el.offsetLeft
            const walk = (x - startX) * 1.5
            el.scrollLeft = scrollLeft - walk
        }

        // el chequeo del loop se hace en cada scroll,
        // sin importar si vino de drag, wheel, o touch
        el.addEventListener("scroll", checkLoop)
        el.addEventListener("mousedown", onMouseDown)
        el.addEventListener("mouseleave", onMouseLeave)
        el.addEventListener("mouseup", onMouseUp)
        el.addEventListener("mousemove", onMouseMove)

        return () => {
            el.removeEventListener("scroll", checkLoop)
            el.removeEventListener("mousedown", onMouseDown)
            el.removeEventListener("mouseleave", onMouseLeave)
            el.removeEventListener("mouseup", onMouseUp)
            el.removeEventListener("mousemove", onMouseMove)
        }
    }, [])

    return { containerRef }
}