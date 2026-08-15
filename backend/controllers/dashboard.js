export class DashboardController {

    constructor({ dashboardModel }) {
        this.dashboardModel = dashboardModel
    }

    getResumen = async (req, res) => {
        const resumen = await this.dashboardModel.getResumen()
        res.json(resumen)
    }
}