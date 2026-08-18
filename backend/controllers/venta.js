import { validateVenta, validateEstado } from "../schemas/venta.js"

export class VentaController {

    constructor({ ventaModel }) {
        this.ventaModel = ventaModel
    }

    // admin: listado completo
    getAll = async (req, res) => {
        const { q, estado, page, perPage } = req.query
        const resultado = await this.ventaModel.getAll({
            query: q?.trim() || undefined,
            estado: estado && estado !== "todos" ? estado : undefined,
            page,
            perPage
        })
        res.json(resultado)
    }
    getById = async (req, res) => {
        const { id } = req.params
        const venta = await this.ventaModel.getById({ id })
        if (!venta) return res.status(404).json({ message: "Venta not found" })
        res.json(venta)
    }

    getTotal = async (req, res) => {
        const total = await this.ventaModel.countAll()
        res.json({ total })
    }


    // público: cualquiera puede comprar, con o sin cuenta
    create = async (req, res) => {
        const result = validateVenta(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        // si vino con token válido, lo asociamos al usuario. Si no, queda como invitado.
        const usuario_id = req.user?.id ?? null

        try {
            const newVenta = await this.ventaModel.create({ object: result.data, usuario_id })
            res.status(201).json(newVenta)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    updateEstado = async (req, res) => {
        const { id } = req.params
        const result = validateEstado(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        try {
            const updatedVenta = await this.ventaModel.updateEstado({ id, estado: result.data.estado })
            res.json(updatedVenta)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    cancelar = async (req, res) => {
        const { id } = req.params
        try {
            const cancelledVenta = await this.ventaModel.cancelar({ id })
            res.json(cancelledVenta)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    getByCodigo = async (req, res) => {
        const { codigo } = req.params
        const venta = await this.ventaModel.getByCodigo({ codigo })
        if (!venta) return res.status(404).json({ message: "Venta not found" })
        res.json(venta)
    }
}