import { MyPieChart } from "../../../../shared/components/charts/MyPieChart/MyPieChart";
import { useEffect, useState } from "react";
import { buildClientsChartData } from "../../services/buildClientsChartData";
import { useSession } from "../../../../shared/contexts/AuthContext";

export function DistributionByStateChart(){

    const {session} = useSession()

    const colors =  ['#005DAC', '#222'];
    const [chartData, setChartData] = useState()
    
        useEffect(() => {
    
            async function build() {
                const {chartStatus} = await buildClientsChartData(session.user_id);
    
                setChartData(chartStatus)
            }
    
            build()
    
        }, [])

    if(!chartData) return;

    return(

        <MyPieChart 
                data={chartData}
                colors={colors}
                title={"Distribución por Estado"}/>

    )

}