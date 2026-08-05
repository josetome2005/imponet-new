import { useState } from "react"
import "./FilterTabs.css"

export function FilterTabs({tabs, defaultTab, onChange}){

    const [activeTab, setActiveTab] = useState(defaultTab)
    const [hoveredTab, setHoveredTab] = useState("")

    const handleClickTab = (tab_name) => {

        setActiveTab(tab_name)
        onChange && onChange(tab_name)

    }


    return(

        <div className="filter__tabs">
            
            {
                tabs?.map(tab => {

                    const isActive = tab.name === activeTab
                    const isHovered = tab.name === hoveredTab
                    
                    const img = isHovered ? tab.hoveredImg : isActive ? tab.activeImg : tab.img

                    return(

                        <div 
                            key={tab.name} 
                            className={`filter__tab ${isActive ? "filter__tab--active" : "" }`} 
                            onClick={() => handleClickTab(tab.name)}
                            onMouseEnter={() => setHoveredTab(tab.name)} 
                            onMouseLeave={() => setHoveredTab(null)}
                            
                            >

                            
                            {
                                tab.img && <img src={img} alt="" />
                            }

                            <span className="filter__tab__label">{tab.label}</span>
                            <span className="filter__tab__quantity" style={{display: `${tab.number !== null && tab.number !== undefined ? "block" : "none"}`}}>{tab?.number}</span>

                        </div>

                    )



                })
            }

        </div>

    )


}