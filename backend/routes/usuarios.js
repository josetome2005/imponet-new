import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createUsuarioRouter = ({ usuarioModel }) => {

    const usuarioRouter = Router();
    const usuarioController = new UsuarioController({ usuarioModel });

    usuarioRouter.get('/', authenticate, usuarioController.getAll);
    usuarioRouter.get('/:id', authenticate, usuarioController.getById);
    usuarioRouter.post('/', authenticate, usuarioController.create);
    usuarioRouter.patch('/:id', authenticate, usuarioController.update);
    usuarioRouter.delete('/:id', authenticate, usuarioController.delete);

    return usuarioRouter;
}