import { Newsletter } from "../Newsletter/Newsletter"
import "./Footer.css"

export function Footer(){


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
                                <li>
                                    <a href="">Notebooks</a>
                                </li>
                                <li>
                                    <a href="">Gaming</a>
                                </li>
                                <li>
                                    <a href="">Audio</a>
                                </li>
                                <li>
                                    <a href="">Entretenimiento</a>
                                </li>
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
                    <p>Imponet  — Av. Colón 1234, Córdoba, Argentina. CUIT 30-71234567-8. Sitio protegido con certificado SSL. </p>
                    <p>© 2026 Imponet · Todos los derechos reservados</p>
                </div>
            </footer>
        </>

    )

}