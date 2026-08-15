import { pool } from "../config/connection_db.js"
import { buildPagination } from "../utils/buildPagination.js"

const SELECT_FIELDS = "SELECT BIN_TO_UUID(id) id, nombre, slug, created_at FROM marcas"

export class MarcaModel {

    static async getAll({ page, perPage }) {

        const [countResult] = await pool.query(`SELECT COUNT(DISTINCT m.id) total FROM marcas m`)
        const total = countResult[0].total

        const { limitClause, limitParams, toResult } = buildPagination({ page, perPage, defaultPerPage: 9 })

        const [marcas] = await pool.query(`${SELECT_FIELDS} ${limitClause}`, limitParams)
        
        return {
            items: marcas,
            pagination: toResult(total)
        }
    }

    static async getById({ id }) {
        const [marcas] = await pool.query(
            `${SELECT_FIELDS} WHERE id = UUID_TO_BIN(?)`,
            [id]
        )
        return marcas[0]
    }

    static async create({ object }) {
        const { nombre, slug } = object
        const [uuidResult] = await pool.query("SELECT UUID() uuid")
        const [{ uuid }] = uuidResult

        try {
            await pool.query(
                "INSERT INTO marcas (id, nombre) VALUES (UUID_TO_BIN(?), ?)",
                [uuid, nombre]
            )
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new Error("Ya existe una marca con ese nombre")
            throw new Error("Error inserting marca: " + error.message)
        }

        return this.getById({ id: uuid })
    }

    static async update({ id, object }) {
        const [result] = await pool.query(
            "UPDATE marcas SET ? WHERE id = UUID_TO_BIN(?)",
            [object, id]
        )
        if (result.affectedRows === 0) throw new Error("Marca not found")
        return this.getById({ id })
    }

    static async delete({ id }) {
        const [result] = await pool.query(
            "DELETE FROM marcas WHERE id = UUID_TO_BIN(?)",
            [id]
        )
        return result.affectedRows > 0
    }

    static async getAllWithCount({ page, perPage }) {
        const [countResult] = await pool.query(`SELECT COUNT(*) total FROM marcas`)
        const total = countResult[0].total

        const { limitClause, limitParams, toResult } = buildPagination({ page, perPage, defaultPerPage: 9 })

        const [marcas] = await pool.query(`
            SELECT BIN_TO_UUID(m.id) id, m.nombre, m.slug, m.created_at,
                   COUNT(p.id) cantidad_productos
            FROM marcas m
            LEFT JOIN productos p ON p.marca_id = m.id
            GROUP BY m.id, m.nombre, m.created_at
            ORDER BY m.nombre
            ${limitClause}
        `, limitParams)

        return {
            items: marcas,
            pagination: toResult(total)
        }
    }
}