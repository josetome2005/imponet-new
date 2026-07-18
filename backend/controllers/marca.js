import { validateMarca, validatePartialMarca } from "../schemas/marca.js"

export class MarcaController {

    constructor({ marcaModel }) {
        this.marcaModel = marcaModel
    }

    getAll = async (req, res) => {
        const marcas = await this.marcaModel.getAll()
        res.json(marcas)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const marca = await this.marcaModel.getById({ id })
        if (!marca) return res.status(404).json({ message: "Marca not found" })
        res.json(marca)
    }

    create = async (req, res) => {
        const result = validateMarca(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        try {
            const newMarca = await this.marcaModel.create({ object: result.data })
            res.status(201).json(newMarca)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    update = async (req, res) => {
        const { id } = req.params
        const result = validatePartialMarca(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        try {
            const updatedMarca = await this.marcaModel.update({ id, object: result.data })
            res.json(updatedMarca)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    delete = async (req, res) => {
        const { id } = req.params
        const deleted = await this.marcaModel.delete({ id })
        if (deleted) return res.status(204).end()
        res.status(404).json({ message: "Marca not found" })
    }
}