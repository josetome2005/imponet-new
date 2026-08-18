import "./MarcaSkeleton.css"
import { Skeleton } from "../../../../shared/components/ui/Skeleton/Skeleton"

export function MarcaSkeleton(){

    return(
        <div className="marca__item marca__skeleton" style={{position: "relative"}}>
            <div className="data__container">
                <div className="actions__container" style={{position: "absolute", right: "1.25rem", top: "1.25rem"}}>
                    <Skeleton circle={true} width="1.375rem" height="1.375rem"/>
                    <Skeleton circle={true} width="1.375rem" height="1.375rem"/>
                </div>
                <div className="flex--8">
                    <Skeleton width={"48px"} height={"48px"}/>
                    <div>
                        <Skeleton width={"60px"} height={"1rem"} style={{display: "block", marginBottom: "10px"}}/>
                        <Skeleton width={"45px"} height={"0.75rem"}/>
                    </div>
                </div>
            </div>
            <div className="productos__tag__container">
                <div className="flex--8 y-center">
                    <Skeleton width="1.25rem" height="1.25rem" />
                    <Skeleton width="100px" height="1.25rem" />
                </div>
                <Skeleton width="1rem" height="1rem" circle={true} />
            </div>
        </div>
    )

}