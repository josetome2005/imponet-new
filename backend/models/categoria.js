import { pool } from "../config/connection_db.js"

const SELECT_FIELDS = "SELECT BIN_TO_UUID(id) id, nombre, created_at FROM categorias"

export class CategoriaModel {

    static async getAll() {
        const [categorias] = await pool.query(SELECT_FIELDS)
        return categorias
    }

    static async getById({ id }) {
        const [categorias] = await pool.query(
            `${SELECT_FIELDS} WHERE id = UUID_TO_BIN(?)`,
            [id]
        )
        return categorias[0]
    }

    static async create({ object }) {
        const { nombre } = object
        const [uuidResult] = await pool.query("SELECT UUID() uuid")
        const [{ uuid }] = uuidResult

        try {
            await pool.query(
                "INSERT INTO categorias (id, nombre) VALUES (UUID_TO_BIN(?), ?)",
                [uuid, nombre]
            )
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new Error("Ya existe una categoría con ese nombre")
            throw new Error("Error inserting categoria: " + error.message)
        }

        return this.getById({ id: uuid })
    }

    static async update({ id, object }) {
        const [result] = await pool.query(
            "UPDATE categorias SET ? WHERE id = UUID_TO_BIN(?)",
            [object, id]
        )
        if (result.affectedRows === 0) throw new Error("Categoria not found")
        return this.getById({ id })
    }

    static async delete({ id }) {
        const [result] = await pool.query(
            "DELETE FROM categorias WHERE id = UUID_TO_BIN(?)",
            [id]
        )
        return result.affectedRows > 0
    }
}