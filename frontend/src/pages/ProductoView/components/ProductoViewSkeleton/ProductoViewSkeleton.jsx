import "./ProductoViewSkeleton.css"
import { Skeleton } from "../../../../shared/components/ui/Skeleton/Skeleton"
import { Button } from "../../../../shared/components/ui/Button/Button"

export function ProductoSliderSkeleton(){

    return(
        <div className="ps">

            <div className="ps-main">
                <div className="ps-track">
                    <Skeleton width="100%" height="100%"/>
                </div>
            </div>
                    
            <div className="ps-thumbs flex--8">
                {
                    Array.from({ length: 3 }).map((_, i) => (
                        <div className="ps-thumb">
                            <Skeleton  height="auto" style={{aspectRatio: "16 / 10"}}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )

}

export function ProductoViewSkeleton(){

    return(
        <div className="producto_view">

            <div className="producto_view__header">
                <Skeleton width={"50px"} height={"1rem"}/>
                <span className="slash"> / </span>
                <Skeleton width={"50px"} height={"1rem"}/>
                <span className="slash"> / </span>
                <Skeleton width={"50px"} height={"1rem"}/>
            </div>

            <div className="producto_view__content">

                <div className="producto_main_content" style={{marginBottom: "25px"}}>
                    <ProductoSliderSkeleton />

                    {
                        <div className="producto_info">
                            <Skeleton width="75px" height="1rem" style={{marginBottom: "1rem"}}/>
                            <Skeleton width="400px" height="3.5rem" style={{marginBottom: "1.5rem"}}/>
                            <div className="categorias__container" style={{marginBottom: "2.75rem"}}>
                                {
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <Skeleton height="1.25rem" width="75px" key={i}/>
                                    ))
                                }
                                

                            </div>
                            
                            <Skeleton width="250px" height="2.5rem" style={{marginBottom: "3.5rem"}}/>
                            
                            <Skeleton width="175px" height="1rem" style={{marginBottom: "1rem"}}/>
                            
                            <div className="flex--16">
                                <Skeleton width="200px" height="50px"/>
                                <Skeleton width="400px" height="50px"/>                       
                            </div>  
                        </div>
                    }
                </div>
                
                {
                    <>
                        <Skeleton width="150px" height="1.25rem" style={{display: "block", marginBottom: "1rem"}}/>
                        <Skeleton width="60%" height="6rem"/>
                    </>
                    
                }
                
                                
            </div>


        </div>
    )

}