import { Router } from "express";
import { ProductoController } from "../controllers/producto.js";
import { authenticate } from "../middlewares/authenticate.js"
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/productos/")
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.originalname)
        cb(null, `${unique}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Solo se permiten imágenes (jpeg, png, webp, gif)"))
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter
})

export const createProductoRouter = ({ productoModel }) => {

    const productoRouter = Router();
    const productoController = new ProductoController({ productoModel });

    // públicos
    productoRouter.get('/', productoController.getAll);
    productoRouter.get('/:id', productoController.getById);

    // admin
    productoRouter.get('/admin/all', authenticate, productoController.getAllAdmin);
    productoRouter.post('/', authenticate, upload.array("imagenes", 6), productoController.create);
    productoRouter.patch('/:id', authenticate, upload.array("imagenes", 6), productoController.update);
    productoRouter.delete('/:id', authenticate, productoController.delete);

    return productoRouter;
}