import { validateProducto, validatePartialProducto, validateIds } from "../schemas/producto.js"

export class ProductoController {

    constructor({ productoModel }) {
        this.productoModel = productoModel
    }

    // Público: solo productos activos
    getAll = async (req, res) => {
        const { destacado, con_descuento, page, perPage } = req.query
        const resultado = await this.productoModel.search({
            activo: true,
            destacado: destacado === "true" ? true : undefined,
            conDescuento: con_descuento === "true",
            page,
            perPage
        })
        res.json(resultado)
    }

    // controller
    getTotal = async (req, res) => {
        const total = await this.productoModel.countAll()
        res.json({ total })
    }

    // Admin: todos, activos o no
    getAllAdmin = async (req, res) => {
        const { activo, page, perPage } = req.query
        const resultado = await this.productoModel.search({
            activo: activo !== undefined ? (activo === "true" || activo === "1") : undefined,
            page,
            perPage
        })
        res.json(resultado)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const producto = await this.productoModel.getById({ id })
        if (!producto) return res.status(404).json({ message: "Producto not found" })
        res.json(producto)
    }

    getByIds = async (req, res) => {
        const result = validateIds(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    
        const productos = await this.productoModel.getByIds({ ids: result.data.ids })
        res.json(productos)
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
        if (body.activo !== undefined) {
            body.activo = body.activo === "true" || body.activo === "1" || body.activo === true || body.activo === 1;
        }
        if (body.destacado !== undefined) {
            body.destacado = body.destacado === "true" || body.destacado === "1" || body.destacado === true || body.destacado === 1;
        }


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
        if (body.destacado !== undefined) body.destacado = body.destacado === "true" || body.destacado === true


        const result = validatePartialProducto(body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        const dataToUpdate = { ...result.data }

        // "imagenes_orden" = array de strings: URL existente, o "NEW" como placeholder de una imagen nueva
        // en el orden final deseado. Los archivos nuevos llegan en req.files en el mismo orden
        // en que aparecen sus placeholders "NEW".
        if (body.imagenes_orden) {
            const orden = JSON.parse(body.imagenes_orden)
            const nuevosArchivos = req.files?.map(f => `/uploads/productos/${f.filename}`) ?? []
            let cursor = 0
            dataToUpdate.imagenes = orden.map(item => item === "NEW" ? nuevosArchivos[cursor++] : item)
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

    // Público: búsqueda completa (texto + marca + categoría + precio + orden + paginación)
    search = async (req, res) => {
        const {
            q,
            marca,
            categoria,
            precioMin,
            precioMax,
            activo,
            destacado,
            con_descuento,
            orden,
            page,
            perPage
        } = req.query
    
        const resultado = await this.productoModel.search({
            query: q?.trim() || undefined,
            marcaSlugs: marca ? marca.split(",") : undefined,
            categoriaSlugs: categoria ? categoria.split(",") : undefined,
            precioMin,
            precioMax,
    
            activo: activo !== undefined
                ? (activo === "true" || activo === "1")
                : undefined,
    
            destacado: destacado !== undefined
                ? (destacado === "true" || destacado === "1")
                : undefined,
    
            conDescuento: con_descuento === "true",
    
            orden,
            page,
            perPage,
        })
    
        res.json(resultado)
    }
}