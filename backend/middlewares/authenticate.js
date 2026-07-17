import jwt from "jsonwebtoken";
import { pool } from "../config/connection_db.js";

export const authenticate = async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "No autorizado" });

    try {
        const { usuario_id } = jwt.verify(token, process.env.JWT_SECRET);

        const [usuarios] = await pool.query(
            "SELECT BIN_TO_UUID(id) id, nombre, email, rol FROM usuarios WHERE id = UUID_TO_BIN(?)",
            [usuario_id]
        )

        if (!usuarios[0]) return res.status(401).json({ error: "No autorizado" })

        req.user = usuarios[0]

        next()

    } catch {
        return res.status(401).json({ error: "No autorizado" })
    }
}