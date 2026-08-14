import "./GroupOfStatCards.css"
import { StatCard } from "../StatCard/StatCard"
import { useState, useEffect } from "react"

export function GroupOfStatCards({buildFunction}){

    const [statCards, setStatCards] = useState([])
    
    useEffect(() => {
        async function fetchData(){
            const data = await buildFunction();
            setStatCards(data)
        }
        fetchData()
    }, [])
    

    return(
        <div className="statCards__container">            
            {
                statCards.map((stat, index) => (

                    <StatCard 
                        key={stat.title} 
                        icon={stat.icon} 
                        title={stat.title} 
                        stat={stat.stat} 
                        description={stat.description}/>
                ))
            }
        </div>
    )

}