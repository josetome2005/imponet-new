import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ?? 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log("✅ CONEXIÓN A MYSQL EXITOSA");
        connection.release();
    })
    .catch(error => {
        console.error("❌ ERROR MYSQL:", error.message);
    });

// Para queries sueltas (sin transacción) usamos "pool" directo,
// mysql2 con pool soporta pool.query() igual que una connection normal.
export const connection = pool;