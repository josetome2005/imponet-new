import { getEntitiesByEntityType } from "../../../shared/services/entities.service"

export async function buildClientsChartData(user_id){

    const clients = await getEntitiesByEntityType("client", user_id);
    
    ///////////// GRÁFICO DE TARTA POR ESTADO DE CLIENTE
    const chartStatus = [
        {
            name: "Activos", value: clients.filter(c => c.state === "Activo").length
        },
        {
            name: "Inactivo", value: clients.filter(c => c.state === "Inactivo").length
        }
    ]

    const chartEvolution = buildEvolutionClientsChart(clients)

    //////////////////////////////////////////////////////////////

    return {chartStatus, chartEvolution}

}


function buildEvolutionClientsChart(clients){


    ////////////// GRÁFICO DE BARRAS DE CLIENTES POR MES
    const now = new Date();

    const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // -- Cliente más antiguo
    const oldest = clients.reduce((min, c) => {
        const date = new Date(c.created_at);
        return date < min ? date : min
    }, new Date())

    // --- Cuántos meses han pasado desde el más antiguo ---
    const monthsSinceOldest = 
        (now.getFullYear() - oldest.getFullYear()) * 12 + 
        (now.getMonth() - oldest.getMonth())

    // --- Máximo 6, mínimo 1 ---
    const monthCount = Math.min(Math.max(monthsSinceOldest + 1, 1), 6)

    // --- Generar solo los meses necesarios ---
    function getPastMonths(count) {

        return Array.from({ length: count })
            .map((_, i) => new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1))
            .map(date => ({
                label: MONTHS_ES[date.getMonth()],
                year:  date.getFullYear(),
                month: date.getMonth(),
            }))
            
    }

    const data = getPastMonths(monthCount).map(({ label, year, month }) => {
        const count = clients.filter(c => {
            const created = new Date(c.created_at)
            return created.getFullYear() === year && created.getMonth() === month
        }).length

        return { mes: label, clientes: count }
    })


    return data;


}