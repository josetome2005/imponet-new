import { pool } from "../config/connection_db.js"
import { buildPagination } from "../utils/buildPagination.js"

const SELECT_FIELDS = "SELECT BIN_TO_UUID(id) id, nombre, slug, destacado, created_at FROM categorias"

export class CategoriaModel {

    static async getAll({ page, perPage, destacado, q } = {}) {
        const conditions = []
        const params = []
        
        if (q) {
            const term = `%${q}%`
            conditions.push(`(c.nombre LIKE ? OR c.slug LIKE ?)`)
            params.push(term, term)
        }

        if (destacado !== undefined) {
            conditions.push("destacado = ?")
            params.push(destacado ? 1 : 0)
        }
    
        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    
        const [countResult] = await pool.query(
            `SELECT COUNT(*) total FROM categorias c ${whereClause}`,
            params
        )
        const total = countResult[0].total
    
        const { limitClause, limitParams, toResult } = buildPagination({ page, perPage })
    
        const [categorias] = await pool.query(
            `${SELECT_FIELDS} ${whereClause} ${limitClause}`,
            [...params, ...limitParams]
        )
    
        return {
            items: categorias,
            pagination: page !== undefined ? toResult(total) : null
        }
    }

    static async getById({ id }) {
        const [categorias] = await pool.query(
            `${SELECT_FIELDS} WHERE id = UUID_TO_BIN(?)`,
            [id]
        )
        return categorias[0]
    }

    static async create({ object }) {
        const { nombre, slug, destacado } = object
        const [uuidResult] = await pool.query("SELECT UUID() uuid")
        const [{ uuid }] = uuidResult

        try {
            await pool.query(
                "INSERT INTO categorias (id, nombre, slug, destacado) VALUES (UUID_TO_BIN(?), ?, ?, ?)",
                [uuid, nombre, slug, destacado ?? false]
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

    static async getAllWithCount({ q, page, perPage, destacado } = {}) {
        const conditions = []
        const params = []
        
        if (q) {
            const term = `%${q}%`
            conditions.push(`(c.nombre LIKE ? OR c.slug LIKE ?)`)
            params.push(term, term)
        }

        if (destacado !== undefined) {
            conditions.push("c.destacado = ?")
            params.push(destacado ? 1 : 0)
        }
    
        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    
        const [countResult] = await pool.query(
            `SELECT COUNT(DISTINCT c.id) total FROM categorias c ${whereClause}`,
            params
        )
        const total = countResult[0].total
    
        const { limitClause, limitParams, toResult } = buildPagination({ page, perPage })
    
        const [categorias] = await pool.query(`
            SELECT BIN_TO_UUID(c.id) id, c.nombre, c.slug, c.destacado, c.created_at,
                   COUNT(pc.producto_id) cantidad_productos
            FROM categorias c
            LEFT JOIN producto_categorias pc ON pc.categoria_id = c.id
            ${whereClause}
            GROUP BY c.id, c.nombre, c.slug, c.destacado, c.created_at
            ORDER BY c.nombre
            ${limitClause}
        `, [...params, ...limitParams])
            
        return {
            items: categorias,
            pagination: page !== undefined ? toResult(total) : null
        }
    }

    static async getDestacadasConImagen() {
        const [categorias] = await pool.query(`
            SELECT BIN_TO_UUID(c.id) id, c.nombre, c.slug
            FROM categorias c
            WHERE c.destacado = 1
            ORDER BY c.nombre
        `)

        // Por cada categoría, traemos varios candidatos de imagen (no solo 1),
        // para poder saltear los que ya se usaron en otra categoría
        const resultado = []
        const imagenesUsadas = new Set()

        for (const cat of categorias) {
            const [productos] = await pool.query(`
            SELECT pi.url
                FROM productos p
                JOIN producto_categorias pc ON pc.producto_id = p.id
                JOIN producto_imagenes pi ON pi.producto_id = p.id AND pi.orden = 0
                WHERE pc.categoria_id = UUID_TO_BIN(?) AND p.activo = 1
                ORDER BY p.created_at DESC
                LIMIT 10
            `, [cat.id])

            // Buscamos la primera imagen que todavía no se usó en otra categoría destacada
            const imagenLibre = productos.find(p => !imagenesUsadas.has(p.url))
            const imagenElegida = imagenLibre?.url ?? productos[0]?.url ?? null

            if (imagenElegida) imagenesUsadas.add(imagenElegida)

            resultado.push({
                nombre: cat.nombre,
                slug: cat.slug,
                imagen: imagenElegida
            })
        }

        return resultado
    }
}