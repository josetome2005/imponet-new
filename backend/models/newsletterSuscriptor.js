import { pool } from "../config/connection_db.js"
import { buildPagination } from "../utils/buildPagination.js"

export class NewsletterSuscriptorModel {

    static async create({ email }) {
        const [uuidResult] = await pool.query("SELECT UUID() uuid")
        const [{ uuid }] = uuidResult

        try {
            await pool.query(
                "INSERT INTO newsletter_suscriptores (id, email) VALUES (UUID_TO_BIN(?), ?)",
                [uuid, email]
            )
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Si ya existía pero estaba dado de baja, lo reactivamos en vez de tirar error
                await pool.query(
                    "UPDATE newsletter_suscriptores SET activo = 1 WHERE email = ?",
                    [email]
                )
                return { email, reactivado: true }
            }
            throw new Error("Error al suscribirse: " + error.message)
        }

        return { email, reactivado: false }
    }
    

    static async getAll({ page, perPage, q, activo } = {}) {
        const conditions = []
        const params = []
        
        if (q) {
            const term = `%${q}%`
            conditions.push(`(s.email LIKE ?)`)
            params.push(term)
        }

        if (activo !== undefined) {
            conditions.push("s.activo = ?")
            params.push(activo ? 1 : 0)
        }
    
        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
        
        const [countResult] = await pool.query(`SELECT COUNT(*) total FROM newsletter_suscriptores s ${whereClause}`, params)
        const total = countResult[0].total
        
        const { limitClause, limitParams, toResult } = buildPagination({ page, perPage })

        const [suscriptores] = await pool.query(
            `SELECT BIN_TO_UUID(s.id) id, s.email, s.activo, s.created_at FROM newsletter_suscriptores s
            ${whereClause}
            ORDER BY s.created_at DESC 
            ${limitClause}`,
            [...params, ...limitParams]
        )

        return {
            items: suscriptores,
            pagination: page !== undefined ? toResult(total) : null
        }
    }

    static async darDeBaja({ email }) {
        const [result] = await pool.query(
            "UPDATE newsletter_suscriptores SET activo = 0 WHERE email = ?",
            [email]
        )
        return result.affectedRows > 0
    }
}