import "./Newsletter.css"
import { Button } from "../../ui/Button/Button"
import { useToast } from "../../../components/toast/ToastContext"
import { useState } from "react"
import { suscribirNewsletter } from "../../../services/newsletter.services"

export function Newsletter(){

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e) => {

        e.preventDefault()

        if(!email.trim()) return;

        setLoading(true)
        try{
            await suscribirNewsletter(email)
            toast.success("¡Listo! Ya estás suscripto.")
            setEmail("")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }


    return(
        <div className="newsletter">
            <div>
                <h3>10% en tu primera compra</h3>
                <p>Sumate y enterate primero de los lanzamientos y ofertas relámpago.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button text={loading ? "Enviando..." : "Quiero mi 10% Off"} mode={"pink"} disabled={loading} />
            </form>
        </div>
    )
}