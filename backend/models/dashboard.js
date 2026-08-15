import { pool } from "../config/connection_db.js"

export class DashboardModel {

    static async getResumen() {

        // Ventas del mes calendario actual (excluye canceladas)
        const [ventasMes] = await pool.query(`
            SELECT COUNT(*) cantidad, COALESCE(SUM(total), 0) monto
            FROM ventas
            WHERE estado != 'cancelado'
              AND YEAR(fecha) = YEAR(CURDATE())
              AND MONTH(fecha) = MONTH(CURDATE())
        `)

        // Pedidos pendientes
        const [pendientes] = await pool.query(`
            SELECT COUNT(*) cantidad FROM ventas WHERE estado = 'pendiente'
        `)

        // Productos activos + valor total de inventario (stock * precio)
        const [productosStats] = await pool.query(`
            SELECT COUNT(*) cantidad, COALESCE(SUM(stock * precio), 0) valor_inventario
            FROM productos
            WHERE activo = 1
        `)

        // Cantidad de marcas y categorias
        const [[ {cantidad: cantidadMarcas }]] = await pool.query(`SELECT COUNT(*) cantidad FROM marcas`)
        const [[{ cantidad: cantidadCategorias }]] = await pool.query("SELECT COUNT(*) cantidad FROM categorias")
        
        // Productos con stock bajo (<= 5)
        const [stockBajo] = await pool.query(`
            SELECT BIN_TO_UUID(id) id, nombre, stock
            FROM productos
            WHERE activo = 1 AND stock <= 5
            ORDER BY stock ASC
            LIMIT 10
        `)

        // Ultimos pedidos pendientes
        const [pedidosPendientes] = await pool.query(`
            SELECT BIN_TO_UUID(id) id, codigo, nombre, total, estado, fecha
            FROM ventas
            WHERE estado = 'pendiente'
            ORDER BY fecha DESC
            LIMIT 10
        `)

        // Ventas por estado
        const [porEstado] = await pool.query(`
            SELECT estado, COUNT(*) cantidad
            FROM ventas
            GROUP BY estado
        `)

        // Ventas de los últimos 7 días - un día por fila
        const [porDia] = await pool.query(`
            SELECT DATE(fecha) dia, COALESCE(SUM(total), 0) total
            FROM ventas
            WHERE estado != 'cancelado'
                AND fecha >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE(fecha)
            ORDER BY dia ASC
        `)

        return {
            ventasMes: {
                monto: ventasMes[0].monto,
                cantidad: ventasMes[0].cantidad
            },
            pedidosPendientesCount: pendientes[0].cantidad,
            productos: {
                activos: productosStats[0].cantidad,
                valorInventario: productosStats[0].valor_inventario,
                cantidadMarcas,
                cantidadCategorias
            },
            stockBajo,
            pedidosPendientes,
            ventasPorEstado: porEstado,
            ventasPorDia: porDia
        }

    }

}