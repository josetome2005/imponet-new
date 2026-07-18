import { pool } from "../config/connection_db.js"

const SELECT_FIELDS = `
    SELECT BIN_TO_UUID(v.id) id, BIN_TO_UUID(v.usuario_id) usuario_id,
           v.nombre, v.email, v.telefono,
           v.direccion_calle, v.direccion_ciudad, v.direccion_provincia, v.direccion_cp,
           v.total, v.estado, v.fecha
    FROM ventas v
`

const attachDetalle = async (venta) => {
    const [detalle] = await pool.query(
        `SELECT BIN_TO_UUID(dv.id) id, BIN_TO_UUID(dv.producto_id) producto_id,
                p.nombre producto_nombre, dv.cantidad, dv.precio_unitario,
                (dv.cantidad * dv.precio_unitario) subtotal
         FROM detalle_ventas dv
         JOIN productos p ON p.id = dv.producto_id
         WHERE dv.venta_id = UUID_TO_BIN(?)`,
        [venta.id]
    )
    return { ...venta, detalle }
}

export class VentaModel {

    static async getAll() {
        const [ventas] = await pool.query(`${SELECT_FIELDS} ORDER BY v.fecha DESC`)
        return Promise.all(ventas.map(attachDetalle))
    }

    static async getById({ id }) {
        const [ventas] = await pool.query(
            `${SELECT_FIELDS} WHERE v.id = UUID_TO_BIN(?)`,
            [id]
        )
        if (!ventas[0]) return null
        return attachDetalle(ventas[0])
    }

    static async create({ object, usuario_id }) {
        const { nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, items } = object

        const conn = await pool.getConnection()
        try {
            await conn.beginTransaction()

            const [uuidResult] = await conn.query("SELECT UUID() uuid")
            const [{ uuid }] = uuidResult

            let total = 0
            const detalleAInsertar = []

            // Por cada item, buscamos el precio REAL y el stock actual en la DB (con lock de fila)
            for (const item of items) {
                const [productos] = await conn.query(
                    `SELECT BIN_TO_UUID(id) id, nombre, precio, descuento, stock, activo
                     FROM productos WHERE id = UUID_TO_BIN(?) FOR UPDATE`,
                    [item.producto_id]
                )
                const producto = productos[0]

                if (!producto) throw new Error(`Producto ${item.producto_id} no existe`)
                if (!producto.activo) throw new Error(`Producto "${producto.nombre}" no está disponible`)
                if (producto.stock < item.cantidad) throw new Error(`Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock})`)

                const precioFinal = Math.round(producto.precio * (1 - producto.descuento / 100))
                total += precioFinal * item.cantidad

                detalleAInsertar.push({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio_unitario: precioFinal
                })

                // Descuenta el stock ya mismo, dentro de la misma transacción
                await conn.query(
                    "UPDATE productos SET stock = stock - ? WHERE id = UUID_TO_BIN(?)",
                    [item.cantidad, item.producto_id]
                )
            }

            await conn.query(
                `INSERT INTO ventas (id, usuario_id, nombre, email, telefono, direccion_calle, direccion_ciudad, direccion_provincia, direccion_cp, total, estado)
                 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
                [uuid, usuario_id ?? null, nombre, email, telefono ?? null, direccion_calle ?? null, direccion_ciudad ?? null, direccion_provincia ?? null, direccion_cp ?? null, total]
            )

            for (const d of detalleAInsertar) {
                const [dvUuid] = await conn.query("SELECT UUID() uuid")
                await conn.query(
                    `INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario)
                     VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
                    [dvUuid[0].uuid, uuid, d.producto_id, d.cantidad, d.precio_unitario]
                )
            }

            await conn.commit()
            return this.getById({ id: uuid })

        } catch (error) {
            await conn.rollback()
            throw new Error(error.message)
        } finally {
            conn.release()
        }
    }

    static async updateEstado({ id, estado }) {
        if (estado === 'cancelado') {
            throw new Error("Para cancelar usá el endpoint de cancelación, así se devuelve el stock correctamente")
        }
        const [result] = await pool.query(
            "UPDATE ventas SET estado = ? WHERE id = UUID_TO_BIN(?)",
            [estado, id]
        )
        if (result.affectedRows === 0) throw new Error("Venta not found")
        return this.getById({ id })
    }

    static async cancelar({ id }) {
        const conn = await pool.getConnection()
        try {
            await conn.beginTransaction()

            const [ventas] = await conn.query(
                "SELECT estado FROM ventas WHERE id = UUID_TO_BIN(?) FOR UPDATE",
                [id]
            )
            if (!ventas[0]) throw new Error("Venta not found")
            if (ventas[0].estado === 'cancelado') throw new Error("La venta ya está cancelada")
            if (ventas[0].estado === 'entregado') throw new Error("No se puede cancelar una venta ya entregada")

            const [detalle] = await conn.query(
                "SELECT BIN_TO_UUID(producto_id) producto_id, cantidad FROM detalle_ventas WHERE venta_id = UUID_TO_BIN(?)",
                [id]
            )

            // Devuelve el stock de cada producto de la venta
            for (const d of detalle) {
                await conn.query(
                    "UPDATE productos SET stock = stock + ? WHERE id = UUID_TO_BIN(?)",
                    [d.cantidad, d.producto_id]
                )
            }

            await conn.query(
                "UPDATE ventas SET estado = 'cancelado' WHERE id = UUID_TO_BIN(?)",
                [id]
            )

            await conn.commit()
        } catch (error) {
            await conn.rollback()
            throw new Error(error.message)
        } finally {
            conn.release()
        }

        return this.getById({ id })
    }
}