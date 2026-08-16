import { Router } from "express";
import { NewsletterSuscriptorController } from "../controllers/newsletterSuscriptor.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createNewsletterSuscriptorRouter = ({ newsletterSuscriptorModel }) => {
    const router = Router();
    const controller = new NewsletterSuscriptorController({ newsletterSuscriptorModel });

    router.post('/', controller.create); // público, cualquiera se suscribe
    router.get('/', authenticate, controller.getAll); // admin, para exportar/ver la lista
    router.patch('/:email', authenticate, controller.darDeBaja);

    return router;
}