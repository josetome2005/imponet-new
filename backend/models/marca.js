import { pool } from "../config/connection_db.js"

const SELECT_FIELDS = "SELECT BIN_TO_UUID(id) id, nombre, created_at FROM marcas"

export class MarcaModel {

    static async getAll() {
        const [marcas] = await pool.query(SELECT_FIELDS)
        return marcas
    }

    static async getById({ id }) {
        const [marcas] = await pool.query(
            `${SELECT_FIELDS} WHERE id = UUID_TO_BIN(?)`,
            [id]
        )
        return marcas[0]
    }

    static async create({ object }) {
        const { nombre } = object
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
}