import { TestimonioItem } from "../../../../shared/components/items/TestimonioItem/TestimonioItem"
import "./Testimonios.css"

const testimonios = [
    {
        text: "Pedí un monitor un martes y el jueves ya lo tenía instalado. Llegó perfecto, con la caja sellada y todo.",
        author_initials: "MG",
        author: "Milagros G.",
        location: "Córdoba"
    },
    {
        text: "Tenía dudas entre dos notebooks y el chat de ayuda me recomendó la que mejor me servía para diseño. Cero arrepentimiento.",
        author_initials: "FR",
        author: "Facundo R.",
        location: "Córdoba"
    },
    {
        text: "Tuve que cambiar un producto por talle de conector y el proceso fue rápido, sin vueltas ni cargos extra.",
        author_initials: "LP",
        author: "Lucía P.",
        location: "Rosario"
    },
]

export function Testimonios(){

    return(

        <div className="testimonios">

            <h3 className="section__title">Lo que dice la gente</h3>
            <p className="section__subtitle">Tu opinión es lo que más nos importa.</p>

            <div className="testimonios__container">
                {
                    testimonios?.map(t => (
                        <TestimonioItem testimonio={t}/>
                    ))
                }
            </div>
        </div>

    )

}