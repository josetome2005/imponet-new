import bcrypt from "bcryptjs"
import { validateUsuario, validatePartialUsuario } from "../schemas/usuario.js"

export class UsuarioController {

    constructor({ usuarioModel }) {
        this.usuarioModel = usuarioModel
    }

    getAll = async (req, res) => {
        const usuarios = await this.usuarioModel.getAll()
        res.json(usuarios)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const usuario = await this.usuarioModel.getById({ id })
        if (!usuario) return res.status(404).json({ message: "Usuario not found" })
        res.json(usuario)
    }

    create = async (req, res) => {
        const result = validateUsuario(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const hashedPassword = await bcrypt.hash(result.data.password, 10)

        try {
            const newUsuario = await this.usuarioModel.create({
                object: { ...result.data, password: hashedPassword }
            })
            res.status(201).json(newUsuario)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    update = async (req, res) => {
        const { id } = req.params
        const result = validatePartialUsuario(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const dataToUpdate = { ...result.data }

        if (dataToUpdate.password) {
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10)
        }

        try {
            const updatedUsuario = await this.usuarioModel.update({ id, object: dataToUpdate })
            res.json(updatedUsuario)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    delete = async (req, res) => {
        const { id } = req.params
        const deleted = await this.usuarioModel.delete({ id })
        if (deleted) return res.status(204).end()
        res.status(404).json({ message: "Usuario not found" })
    }
}