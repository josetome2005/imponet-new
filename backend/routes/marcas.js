import { Router } from "express";
import { MarcaController } from "../controllers/marca.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createMarcaRouter = ({ marcaModel }) => {

    const marcaRouter = Router();
    const marcaController = new MarcaController({ marcaModel });

    marcaRouter.get('/', marcaController.getAll);
    marcaRouter.get('/con-cantidad', marcaController.getAllWithCount); 
    marcaRouter.get('/:id', marcaController.getById);

    marcaRouter.post('/', authenticate, marcaController.create);
    marcaRouter.patch('/:id', authenticate, marcaController.update);
    marcaRouter.delete('/:id', authenticate, marcaController.delete);

    return marcaRouter;
}