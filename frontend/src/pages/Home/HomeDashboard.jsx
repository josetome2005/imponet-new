import "./HomeDashboard.css"
import { Header } from "./components/Header/Header"
import { Hero } from "./components/Hero/Hero"
import { PropiedadesDestacadas } from "./components/PropiedadesDestacadas/PropiedadesDestacadas"
import { CategoriasDestacadas } from "./components/CategoriasDestacadas/CategoriasDestacadas"
import { Marcas } from "./components/Marcas/Marcas"

export function HomeDashboard(){


    return(

        <>
            <Header/>
            <Hero />
            <CategoriasDestacadas />
            <Marcas />
            <PropiedadesDestacadas />
            
        </>

    )

}