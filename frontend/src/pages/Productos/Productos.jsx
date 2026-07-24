import { Footer } from "../../shared/components/layout/Footer/Footer"
import { Header } from "../../shared/components/layout/Header/Header"
import { useSearchParams } from "react-router-dom"
import "./Productos.css"

export function Productos(){

    const [searchParams] = useSearchParams()

    const marca = searchParams.get("marca")
    const categoria = searchParams.get("categoria")
    const page = searchParams.get("page") ?? 1

    return(

        <>
            <Header />

            <div className="productos">

                <div className="productos__header">
                    <h3>{categoria}</h3>
                </div>  

            </div>

            <Footer/>
        </>

    )

}