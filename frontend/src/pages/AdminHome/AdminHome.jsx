import "./AdminHome.css"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { GroupOfStatCards } from "../../shared/components/charts/GroupOfStatCards/GroupOfStatCards"
import { useEffect, useState } from "react"
import { buildStatCards } from "./util/buildStatCards"
import { ProductosBajoStock } from "./components/ProductosBajoStock/ProductosBajoStock"
import { PedidosPendientes } from "./components/PedidosPendientes/PedidosPendientes"

//img, color, title, info,

 

export function AdminHome(){

        return(

        <section className="admin__section admin__home">
            <SectionTitle 
                title={"Dashboard"}
                subtitle={"Resumen de tu catálogo de Imponet."}/>

            <GroupOfStatCards 
                buildFunction={buildStatCards}/>

            <div className="charts__container">
                <ProductosBajoStock />
                <PedidosPendientes />
            </div>
        </section>
    )

}