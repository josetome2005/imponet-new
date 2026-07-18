import { Router } from "express";
import { MarcaController } from "../controllers/marca.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createMarcaRouter = ({ marcaModel }) => {

    const marcaRouter = Router();
    const marcaController = new MarcaController({ marcaModel });

    // público, para que el frontend pueda armar filtros/selects
    marcaRouter.get('/', marcaController.getAll);
    marcaRouter.get('/:id', marcaController.getById);

    // admin
    marcaRouter.post('/', authenticate, marcaController.create);
    marcaRouter.patch('/:id', authenticate, marcaController.update);
    marcaRouter.delete('/:id', authenticate, marcaController.delete);

    return marcaRouter;
}