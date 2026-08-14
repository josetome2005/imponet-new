import "./GroupOfDataCards.css"
import { DataCard } from "../DataCard/DataCard"

export function GroupOfDataCards({listOfDataCards}){

    const number = listOfDataCards?.length

    return(
        <div className="data__cards__container">

            {
                listOfDataCards?.map(dc => (

                    <DataCard key={dc.title} img={dc.icon} color={dc.color} title={dc.title} info={dc.info} number={number} />


                ))
            }


        </div>
    )

}