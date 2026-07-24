import "./Newsletter.css"
import { Button } from "../../ui/Button/Button"

export function Newsletter(){

    return(
        <div className="newsletter">
            <div>
                <h3>10% en tu primera compra</h3>
                <p>Sumate y enterate primero de los lanzamientos y ofertas relámpago.</p>
            </div>

            <form action="">
                <input type="text" />
                <Button text={"Quiero mi 10% Off"} mode={"pink"}/>
            </form>
        </div>
    )
}