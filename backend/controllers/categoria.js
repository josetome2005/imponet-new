import { validateCategoria, validatePartialCategoria } from "../schemas/categoria.js"

export class CategoriaController {

    constructor({ categoriaModel }) {
        this.categoriaModel = categoriaModel
    }

    getAll = async (req, res) => {
        const { q, destacado, page, perPage } = req.query
        const categorias = await this.categoriaModel.getAll({
            q,
            destacado: destacado !== undefined ? (destacado === "true" || destacado === "1") : undefined,
            page,
            perPage
        })
        res.json(categorias)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const categoria = await this.categoriaModel.getById({ id })
        if (!categoria) return res.status(404).json({ message: "Categoria not found" })
        res.json(categoria)
    }

    getDestacadas = async (req, res) => {
        const { items } = await this.categoriaModel.getAllWithCount({ destacado: true })
        res.json(items)
    }

    getDestacadasConImagen = async (req, res) => {
        const categorias = await this.categoriaModel.getDestacadasConImagen()
        res.json(categorias)
    }

    create = async (req, res) => {
        const result = validateCategoria(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        try {
            const newCategoria = await this.categoriaModel.create({ object: result.data })
            res.status(201).json(newCategoria)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    update = async (req, res) => {
        const { id } = req.params
        const result = validatePartialCategoria(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        try {
            const updatedCategoria = await this.categoriaModel.update({ id, object: result.data })
            res.json(updatedCategoria)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    delete = async (req, res) => {
        const { id } = req.params
        const deleted = await this.categoriaModel.delete({ id })
        if (deleted) return res.status(204).end()
        res.status(404).json({ message: "Categoria not found" })
    }

    getAllWithCount = async (req, res) => {
        const { q, destacado, page, perPage } = req.query
        const categorias = await this.categoriaModel.getAllWithCount({
            q,
            destacado: destacado !== undefined ? (destacado === "true" || destacado === "1") : undefined,
            page,
            perPage
        })
        res.json(categorias)
    }
}