import "./ProductoItem.css"
import { Skeleton } from "../../../components/ui/Skeleton/Skeleton"

export function ProductoItemSkeleton(){

    return(

        <div className="producto__item">
            <Skeleton width="100%" height="210px" style={{borderRadius: "10px 10px 0px 0px", marginBottom: "10px"}}/>
            
            <Skeleton width="75px" height="0.75rem" style={{display: "block", marginBottom: "0.5rem"}}/>
            <Skeleton width="150px" height="0.875rem" style={{display: "block", marginBottom: "0.75rem"}}/>

            <Skeleton width="100px" height="1.125rem"/>                  
        </div>

    )

}