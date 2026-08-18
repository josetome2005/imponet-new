import { Skeleton } from "../../../../shared/components/ui/Skeleton/Skeleton";

export function CarritoItemSkeleton(){

   return(
           <div className="carrito__item">
               <div className="img__container">
                   <Skeleton width="100%" height="100%" />
               </div>
               <div className="item__data">
                   <Skeleton width="175px" height="1.175rem"/>
                    <Skeleton width="125px" height="1rem"/>
                  
                   <Skeleton width="100px" height="30px" />
               </div>
   
               <Skeleton width="1.5rem" height="1.5rem" circle={true} style={{position: "absolute", right: "0.75rem", top: "0.75rem"}}/>
   
                <Skeleton width="150px" height="1.5rem" style={{ position: "absolute", right: "0.75rem", bottom: "0.75rem" }} />
           </div>
       ) 
}