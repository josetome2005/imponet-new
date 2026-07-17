import { validateProducto, validatePartialProducto } from "../schemas/producto.js"

export class ProductoController {

    constructor({ productoModel }) {
        this.productoModel = productoModel
    }

    // Público: solo productos activos
    getAll = async (req, res) => {
        const productos = await this.productoModel.getAll({ activo: true })
        res.json(productos)
    }

    // Admin: todos, activos o no
    getAllAdmin = async (req, res) => {
        const productos = await this.productoModel.getAll()
        res.json(productos)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const producto = await this.productoModel.getById({ id })
        if (!producto) return res.status(404).json({ message: "Producto not found" })
        res.json(producto)
    }

    create = async (req, res) => {
        const body = { ...req.body }

        // categoria_ids llega como string separado por comas desde form-data
        if (typeof body.categoria_ids === "string") {
            body.categoria_ids = body.categoria_ids.split(",").filter(Boolean)
        }
        if (body.precio) body.precio = Number(body.precio)
        if (body.descuento) body.descuento = Number(body.descuento)
        if (body.stock) body.stock = Number(body.stock)
        if (body.activo !== undefined) body.activo = body.activo === "true" || body.activo === true

        const result = validateProducto(body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const imagenes = req.files?.map(file => `/uploads/productos/${file.filename}`) ?? []

        const newProducto = await this.productoModel.create({ object: { ...result.data, imagenes } })
        res.status(201).json(newProducto)
    }

    update = async (req, res) => {
        const { id } = req.params
        const body = { ...req.body }

        if (typeof body.categoria_ids === "string") {
            body.categoria_ids = body.categoria_ids.split(",").filter(Boolean)
        }
        if (body.precio) body.precio = Number(body.precio)
        if (body.descuento) body.descuento = Number(body.descuento)
        if (body.stock) body.stock = Number(body.stock)
        if (body.activo !== undefined) body.activo = body.activo === "true" || body.activo === true

        const result = validatePartialProducto(body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const dataToUpdate = { ...result.data }

        if (req.files?.length) {
            dataToUpdate.imagenes = req.files.map(file => `/uploads/productos/${file.filename}`)
        }

        const updatedProducto = await this.productoModel.update({ id, object: dataToUpdate })
        if (!updatedProducto) return res.status(404).json({ message: "Producto not found" })
        res.json(updatedProducto)
    }

    delete = async (req, res) => {
        const { id } = req.params
        const deleted = await this.productoModel.delete({ id })
        if (deleted) return res.status(204).end()
        res.status(404).json({ message: "Producto not found" })
    }
}