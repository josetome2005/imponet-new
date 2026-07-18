import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createCategoriaRouter = ({ categoriaModel }) => {

    const categoriaRouter = Router();
    const categoriaController = new CategoriaController({ categoriaModel });

    // público
    categoriaRouter.get('/', categoriaController.getAll);
    categoriaRouter.get('/:id', categoriaController.getById);

    // admin
    categoriaRouter.post('/', authenticate, categoriaController.create);
    categoriaRouter.patch('/:id', authenticate, categoriaController.update);
    categoriaRouter.delete('/:id', authenticate, categoriaController.delete);

    return categoriaRouter;
}