import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validateLogin } from "../schemas/auth.js"
import { UsuarioModel } from "../models/usuario.js"

export class AuthController {

    login = async (req, res) => {
        const result = validateLogin(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const { email, password } = result.data

        const usuario = await UsuarioModel.getByEmailWithPassword({ email })
        if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" })

        const isValid = await bcrypt.compare(password, usuario.password)
        if (!isValid) return res.status(401).json({ error: "Credenciales inválidas" })

        const token = jwt.sign(
            { usuario_id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        })
    }

    me = async (req, res) => {
        res.json(req.user)
    }
}