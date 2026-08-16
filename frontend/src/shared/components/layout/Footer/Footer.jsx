import "./Footer.css"
import { Newsletter } from "../Newsletter/Newsletter"
import { useState, useEffect } from "react"
import { getCategoriasDestacadas } from "../../../services/categorias.services"
import { useNavigate } from "react-router-dom"

export function Footer(){

    const [categorias, setCategorias] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchCategorias(){
            const data = await getCategoriasDestacadas()
            const categoriasDestacadas = data
                .slice()
                .sort((a, b) => b.cantidad_productos - a.cantidad_productos)
                .slice(0, 5)
            setCategorias(categoriasDestacadas)
        }
        fetchCategorias()
    }, [])

    const handleGoTo = (path) => {
        navigate(path)
        window.scrollTo({top: 0})
    }


    return(

        <>  
            <Newsletter />
            
            <footer className="footer">
                <div className="footer__container">
                    <div>
                        <img src="/img/resources/logo.png" alt="Logo de Imponet" className="logo"/>
                        <p className="description">Tienda multimarca de tecnología. Más de 40 marcas oficiales, un solo lugar para comprar sin dudar.</p>
                    </div>

                    <div className="lists__container">
                        <div>
                            <h4>Ayuda</h4>
                            <ul>
                                <li>
                                    <a href="">Preguntas Frecuentes</a>
                                </li>
                                <li>
                                    <a href="">Cómo Comprar</a>
                                </li>
                                <li>
                                    <a href="">Contacto</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>Categorias</h4>
                            <ul>
                                {
                                    categorias?.map(c => (
                                        <li>
                                            <a onClick={() => handleGoTo(`/productos?categoria=${c.slug}`)}>{c.nombre}</a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div>
                            <h4>Legales</h4>
                            <ul>
                                <li>
                                    <a href="">Terminos y Condiciones</a>
                                </li>
                                <li>
                                    <a href="">Política de Privacidad</a>
                                </li>
                                <li>
                                    <a href="">Defensa del consumidor</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bottom__footer">
                    <p>Imponet - Productos Tecnología </p>
                    <p>© 2026 Imponet · Todos los derechos reservados</p>
                </div>
            </footer>
        </>

    )

}