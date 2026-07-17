import { pool } from "../config/connection_db.js"

const SELECT_FIELDS = "SELECT BIN_TO_UUID(id) id, nombre, email, telefono, rol, created_at FROM usuarios"

export class UsuarioModel {

    static async getAll() {
        const [usuarios] = await pool.query(SELECT_FIELDS)
        return usuarios
    }

    static async getById({ id }) {
        const [usuarios] = await pool.query(
            `${SELECT_FIELDS} WHERE id = UUID_TO_BIN(?)`,
            [id]
        )
        return usuarios[0]
    }

    // Trae también el password hasheado, SOLO para uso interno de auth (login)
    static async getByEmailWithPassword({ email }) {
        const [usuarios] = await pool.query(
            "SELECT BIN_TO_UUID(id) id, nombre, email, password, rol FROM usuarios WHERE email = ?",
            [email]
        )
        return usuarios[0]
    }

    static async create({ object }) {
        const { nombre, email, password, telefono, rol } = object

        const [uuidResult] = await pool.query("SELECT UUID() uuid")
        const [{ uuid }] = uuidResult

        try {
            await pool.query(
                `INSERT INTO usuarios (id, nombre, email, password, telefono, rol) VALUES
                (UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
                [uuid, nombre, email, password, telefono ?? null, rol ?? 'cliente']
            )
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new Error("El email ya está registrado")
            throw new Error("Error inserting usuario: " + error.message)
        }

        return this.getById({ id: uuid })
    }

    static async update({ id, object }) {
        const [result] = await pool.query(
            "UPDATE usuarios SET ? WHERE id = UUID_TO_BIN(?)",
            [object, id]
        )
        if (result.affectedRows === 0) throw new Error("Usuario not found")
        return this.getById({ id })
    }

    static async delete({ id }) {
        const [result] = await pool.query(
            "DELETE FROM usuarios WHERE id = UUID_TO_BIN(?)",
            [id]
        )
        return result.affectedRows > 0
    }
}