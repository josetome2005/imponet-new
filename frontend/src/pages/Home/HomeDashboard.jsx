import "./HomeDashboard.css"
import { Header } from "../../shared/components/layout/Header/Header"
import { Hero } from "./components/Hero/Hero"
import { CategoriasDestacadas } from "./components/CategoriasDestacadas/CategoriasDestacadas"
import { Marcas } from "./components/Marcas/Marcas"
import { ProductosDestacados } from "./components/ProductosDestacados/ProductosDestacados"
import { Testimonios } from "./components/Testimonios/Testimonios"
import { Ofertas } from "./components/Ofertas/Ofertas"
import { Footer } from "../../shared/components/layout/Footer/Footer"


export function HomeDashboard(){


    return(

        <>
            <Header/>
            <Hero />
            <CategoriasDestacadas />
            <Marcas />
            <ProductosDestacados />
            <Testimonios />
            <Ofertas />
            <Footer />
        </>

    )

}