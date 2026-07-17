import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createAuthRouter = () => {
    const authRouter = Router();
    const authController = new AuthController();

    authRouter.post('/login', authController.login);
    authRouter.get('/me', authenticate, authController.me);

    return authRouter;
}