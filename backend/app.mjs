import express, { json } from 'express';
import "dotenv/config"
import cors from 'cors';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { createProductoRouter } from './routes/productos.js';
import { createAuthRouter } from './routes/auth.js';
//import { createMarcaRouter } from './routes/marcas.js';
//import { createCategoriaRouter } from './routes/categorias.js';
// import { createUsuarioRouter } from './routes/usuarios.js';
// import { createDireccionRouter } from './routes/direcciones.js';
// import { createVentaRouter } from './routes/ventas.js';
// import { createDetalleVentaRouter } from './routes/detalle_ventas.js';
// import { createAuthRouter } from './routes/auth.js';

console.log("app.mjs cargando...")

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const productImagesDir = path.join(uploadsDir, "productos");
if (!fs.existsSync(productImagesDir)) fs.mkdirSync(productImagesDir);

export const createApp = (
    {
        marcaModel,
        categoriaModel,
        productoModel,
        usuarioModel,
        direccionModel,
        ventaModel,
        detalleVentaModel
    }) => {

    console.log("createApp iniciando...")
    const app = express()
    console.log("express creado")

    app.use(cors({
        origin: ['http://localhost:5174', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }))
    console.log("cors ok")

    app.use((req, res, next) => {
        if (req.path.startsWith('/productos') && req.method === 'POST') {
            return next() // saltear json parser para upload de imágenes
        }
        json()(req, res, next)
    })
    console.log("json ok")
    app.disable('x-powered-by')

    app.use('/productos', createProductoRouter({ productoModel }))
    app.use('/auth', createAuthRouter())
    //app.use('/marcas', createMarcaRouter({ marcaModel }))
    //app.use('/categorias', createCategoriaRouter({ categoriaModel }))
    // app.use('/usuarios', createUsuarioRouter({ usuarioModel }))
    // app.use('/direcciones', createDireccionRouter({ direccionModel }))
    // app.use('/ventas', createVentaRouter({ ventaModel }))
    // app.use('/detalle-ventas', createDetalleVentaRouter({ detalleVentaModel }))
    // app.use('/auth', createAuthRouter())

    app.use("/uploads", express.static(path.resolve("uploads")))

    const PORT = process.env.PORT ?? 1234;
    app.listen(PORT, () => {
        console.log(`Server is running on port 'http://localhost:${PORT}'`);
    })
}