import { useDragScroll } from "../../../../shared/hooks/useDragScroll"
import "./Marcas.css"

const marcasBase = [
    {
        id: crypto.randomUUID(),
        name: "LG",
        img: "/img/marcas/lg.png"
    },
    {
        id: crypto.randomUUID(),
        name: "Philips",
        img: "/img/marcas/philips.png"
    },
    {
        id: crypto.randomUUID(),
        name: "Sony",
        img: "/img/marcas/sony.png"
    },
    {
        id: crypto.randomUUID(),
        name: "Noblex",
        img: "/img/marcas/noblex.png"
    },
    {
        id: crypto.randomUUID(),
        name: "JBL",
        img: "/img/marcas/jbl.png"
    },
    {
        id: crypto.randomUUID(),
        name: "DJI",
        img: "/img/marcas/dji.png"
    },
    {
        id: crypto.randomUUID(),
        name: "Lg",
        img: "/img/marcas/razer.png"
    },
    
]

const marcas = [...marcasBase, ...marcasBase, ...marcasBase]

export function Marcas(){

    const { containerRef } = useDragScroll()

    return(

        <div className="marcas">

            <div className="marcas__container" ref={containerRef}>
                {
                    marcas?.map(m => (
                        <img key={m.id} src={m.img} alt={m.name} draggable={false}/>
                    ))
                }
            </div>

        </div>

    )

}