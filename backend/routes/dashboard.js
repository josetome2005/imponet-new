import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.js";
import { authenticate } from "../middlewares/authenticate.js"

export const createDashboardRouter = ({ dashboardModel }) => {
    const dashboardRouter = Router();
    const dashboardController = new DashboardController({ dashboardModel });

    dashboardRouter.get('/resumen', authenticate, dashboardController.getResumen);

    return dashboardRouter;
}