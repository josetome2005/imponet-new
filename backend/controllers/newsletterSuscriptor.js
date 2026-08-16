import { validateEmail } from "../schemas/newsletterSuscriptor.js"

export class NewsletterSuscriptorController {

    constructor({ newsletterSuscriptorModel }) {
        this.newsletterSuscriptorModel = newsletterSuscriptorModel
    }

    create = async (req, res) => {
        const result = validateEmail(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

        try {
            const suscriptor = await this.newsletterSuscriptorModel.create(result.data)
            res.status(201).json(suscriptor)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    // Admin
    getAll = async (req, res) => {
        const { page, perPage, q, activo } = req.query
        const suscriptores = await this.newsletterSuscriptorModel.getAll({
            q,
            activo: activo !== undefined ? (activo === "true" || activo === "1") : undefined,
            page,
            perPage
        })
        res.json(suscriptores)
    }

    darDeBaja = async (req, res) => {
        const { email } = req.params

        try {
            const resultado = await this.newsletterSuscriptorModel.darDeBaja({email})

            if (!resultado) return res.status(404).json({error: "No existe un suscriptor con ese email" })

            res.json({
                message: "Suscriptor dado de baja correctamente"
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }

    }
    
        
}