import { pool } from "../config/connection_db.js"

const SELECT_FIELDS = `
    SELECT BIN_TO_UUID(p.id) id, BIN_TO_UUID(p.marca_id) marca_id, m.nombre marca_nombre,
           p.nombre, p.descripcion, p.precio, p.descuento, p.stock,
           p.dimensiones, p.extra, p.activo, p.created_at, p.updated_at, p.sku
    FROM productos p
    LEFT JOIN marcas m ON m.id = p.marca_id
`

const attachRelations = async (producto) => {
    const [imagenes] = await pool.query(
        "SELECT BIN_TO_UUID(id) id, url, orden FROM producto_imagenes WHERE producto_id = UUID_TO_BIN(?) ORDER BY orden",
        [producto.id]
    )
    const [categorias] = await pool.query(
        `SELECT BIN_TO_UUID(c.id) id, c.nombre FROM categorias c
         JOIN producto_categorias pc ON pc.categoria_id = c.id
         WHERE pc.producto_id = UUID_TO_BIN(?)`,
        [producto.id]
    )
    return { ...producto, imagenes, categorias }
}

export class ProductoModel {

    static async getAll({ activo, destacado, conDescuento, limit } = {}) {

        const conditions = [];
        const params = [];

        if(activo !== undefined) {
            conditions.push("p.activo = ?")
            params.push(activo ? 1 : 0)
        }

        if(destacado !== undefined) {
            conditions.push("p.destacado = ?")
            params.push(destacado ? 1 : 0)
        }

        if (conDescuento) {
            conditions.push("p.descuento > 0")
        }


        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
        const limitClause = limit ? `LIMIT ${Number(limit)}` : ""

        const [productos] = await pool.query(`${SELECT_FIELDS} ${where} ORDER BY p.created_at DESC ${limitClause}`, params)
        return Promise.all(productos.map(attachRelations))
    }

    static async getById({ id }) {
        const [productos] = await pool.query(
            `${SELECT_FIELDS} WHERE p.id = UUID_TO_BIN(?)`,
            [id]
        )
        if (!productos[0]) return null
        return attachRelations(productos[0])
    }

    static async getByIds({ ids }) {
        if (!ids?.length) return []
    
        const placeholders = ids.map(() => "UUID_TO_BIN(?)").join(", ")
        const [productos] = await pool.query(
            `${SELECT_FIELDS} WHERE p.id IN (${placeholders})`,
            ids
        )
        return Promise.all(productos.map(attachRelations))
    }

    static async create({ object }) {
        const { nombre, descripcion, precio, descuento, stock, dimensiones, extra, activo, marca_id, categoria_ids, imagenes, sku } = object

        const [uuidResult] = await pool.query("SELECT UUID() uuid")
        const [{ uuid }] = uuidResult

        const conn = await pool.getConnection()
        try {
            await conn.beginTransaction()

            await conn.query(
                `INSERT INTO productos (id, marca_id, nombre, descripcion, precio, descuento, stock, dimensiones, extra, activo, sku)
                 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [uuid, marca_id ?? null, nombre, descripcion ?? null, precio, descuento ?? 0, stock ?? 0, dimensiones ?? null, extra ?? null, activo ?? true, sku]
            )

            if (categoria_ids?.length) {
                for (const cid of categoria_ids) {
                    await conn.query(
                        "INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?))",
                        [uuid, cid]
                    )
                }
            }

            if (imagenes?.length) {
                for (let i = 0; i < imagenes.length; i++) {
                    const [imgUuid] = await conn.query("SELECT UUID() uuid")
                    await conn.query(
                        "INSERT INTO producto_imagenes (id, producto_id, url, orden) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)",
                        [imgUuid[0].uuid, uuid, imagenes[i], i]
                    )
                }
            }

            await conn.commit()
        } catch (error) {
            await conn.rollback()
            throw new Error("Error inserting producto: " + error.message)
        } finally {
            conn.release()
        }

        return this.getById({ id: uuid })
    }

    static async update({ id, object }) {
        const { categoria_ids, imagenes, marca_id, ...fields } = object

        const conn = await pool.getConnection()
        try {
            await conn.beginTransaction()

            if (marca_id !== undefined) {
                await conn.query(
                    "UPDATE productos SET marca_id = UUID_TO_BIN(?) WHERE id = UUID_TO_BIN(?)",
                    [marca_id, id]
                )
            }

            if (Object.keys(fields).length) {
                await conn.query(
                    "UPDATE productos SET ? WHERE id = UUID_TO_BIN(?)",
                    [fields, id]
                )
            }

            if (categoria_ids) {
                await conn.query("DELETE FROM producto_categorias WHERE producto_id = UUID_TO_BIN(?)", [id])
                for (const cid of categoria_ids) {
                    await conn.query(
                        "INSERT INTO producto_categorias (producto_id, categoria_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?))",
                        [id, cid]
                    )
                }
            }

            if (imagenes) {
                await conn.query("DELETE FROM producto_imagenes WHERE producto_id = UUID_TO_BIN(?)", [id])
                for (let i = 0; i < imagenes.length; i++) {
                    const [imgUuid] = await conn.query("SELECT UUID() uuid")
                    await conn.query(
                        "INSERT INTO producto_imagenes (id, producto_id, url, orden) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)",
                        [imgUuid[0].uuid, id, imagenes[i], i]
                    )
                }
            }

            await conn.commit()
        } catch (error) {
            await conn.rollback()
            throw new Error("Error updating producto: " + error.message)
        } finally {
            conn.release()
        }

        return this.getById({ id })
    }

    static async delete({ id }) {
        const [result] = await pool.query(
            "DELETE FROM productos WHERE id = UUID_TO_BIN(?)",
            [id]
        )
        return result.affectedRows > 0
    }
}