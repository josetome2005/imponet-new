import "./Login.css"
import { login } from "../../shared/services/auth.services"
import { useState } from "react";
import { useNavigate } from "react-router-dom"

export function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)
        setLoading(true)

        try{
            await login({email, password})
            navigate("/admin")
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    };

    return(

        <div className="login">

            <img className="logo" src="/img/resources/logo.png" alt="Logo Imponet" />

            <form action="" onSubmit={handleSubmit}>
                <h3>Bienvenido.</h3>
                <p>Ingresa para administrar tu tienda.</p>

                <label htmlFor="">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="tuemail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>

                <label htmlFor="">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="****" 
                    autoComplete="on"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>

                {error && <p className="error">{error}</p>}

                <input 
                    type="submit" 
                    value={loading ? "Ingresando..." : "Ingresar"} 
                    disabled={loading} />
            </form>
        </div>

    )


}