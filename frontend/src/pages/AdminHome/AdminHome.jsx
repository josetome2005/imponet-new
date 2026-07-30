import "./AdminHome.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"

export function AdminHome(){

    return(

        <section className="admin__section admin__home">
            <SectionTitle 
                title={"Dashboard"}
                subtitle={"Resumen de tu catálogo de Imponet."}/>
        </section>
    )

}