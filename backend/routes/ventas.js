import { Router } from "express";
import { VentaController } from "../controllers/venta.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createVentaRouter = ({ ventaModel }) => {

    const ventaRouter = Router();
    const ventaController = new VentaController({ ventaModel });

    // público: cualquiera compra, sin necesidad de cuenta
    ventaRouter.post('/', ventaController.create);

    // admin
    ventaRouter.get('/', authenticate, ventaController.getAll);
    ventaRouter.get('/:id', authenticate, ventaController.getById);
    ventaRouter.patch('/:id/estado', authenticate, ventaController.updateEstado);
    ventaRouter.post('/:id/cancelar', authenticate, ventaController.cancelar);

    return ventaRouter;
}