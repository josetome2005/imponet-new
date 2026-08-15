import "./GroupOfStatCards.css"
import { StatCard } from "../StatCard/StatCard"
import { useState, useEffect } from "react"

export function GroupOfStatCards({ statCards }){

    return(
        <div className="statCards__container">            
            {
                statCards.map((stat) => (

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