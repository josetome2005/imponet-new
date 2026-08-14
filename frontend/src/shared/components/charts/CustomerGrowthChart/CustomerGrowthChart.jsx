import { useEffect, useState } from "react";
import {MyBarChart} from "../../../../shared/components/charts/MyBarChart/MyBarChart"
import { buildClientsChartData } from "../../services/buildClientsChartData";
import { useSession } from "../../../../shared/contexts/AuthContext"

export function CustomerGrowthChart(){

    const [chartData, setChartData] = useState()
    const {session} = useSession()

    useEffect(() => {

        async function build() {
            const {chartEvolution} = await buildClientsChartData(session.user_id);

            setChartData(chartEvolution)
        }

        build()

    }, [])

    if(!chartData) return;

    return(

        <MyBarChart 
                data={chartData}
                title={"Crecimiento de Clientes"}
                xAxisTitle={"mes"}
                yAxisTitle={"clientes"}/>

    )

} 