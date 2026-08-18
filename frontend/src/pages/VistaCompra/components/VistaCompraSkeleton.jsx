// components/SkeletonVistaCompra.jsx
import { Skeleton } from "../../../shared/components/ui/Skeleton/Skeleton"

export function VistaCompraSkeleton() {
    return (
        <>
            <div className="vista__compra__header">
                <div>
                    <Skeleton width="350px" height="3rem" style={{display: "block"}} />
                    <Skeleton width="220px" height="0.9rem" style={{ marginTop: 8 }} />
                </div>
                <Skeleton width="150px" height="32px" radius="20px" />
            </div>

            <div className="vista__compra__data__container">

                <div className="left_row">

                    <div className="vista__compra__card states__container">
                        <Skeleton width="160px" height="1.25rem" style={{ marginBottom: 16 }} />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div className="state__item" key={i}>
                                <div className="flex--4 x-center icon__container">
                                    <Skeleton circle width={50} height={50} />
                                    {i < 3 && <div className="barra_progreso"></div>}
                                </div>
                                <div>
                                    <Skeleton width="100px" height="0.9rem" style={{ display: "block", marginTop: 6 }}/>
                                    <Skeleton width="400px" height="0.8rem" style={{ marginTop: 10 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="vista__compra__card productos">
                        <Skeleton width="120px" height="1.1rem" style={{ marginBottom: 16 }} />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div className="vista__compra__producto" key={i}>
                                <div>
                                    <Skeleton width="160px" height="0.9rem" style={{ display: "block", marginBottom: 6 }} />
                                    <Skeleton width="90px" height="0.8rem" style={{ marginTop: 6 }} />
                                </div>
                                <Skeleton width="120px" height="1.25rem" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right_row">

                    <div className="vista__compra__card resumen">
                        <Skeleton width="100px" height="1.1rem" style={{ marginBottom: 16 }} />
                        <div className="resumen__row">
                            <Skeleton width="60px" height="0.9rem" />
                            <Skeleton width="80px" height="0.9rem" />
                        </div>
                        <div className="resumen__row">
                            <Skeleton width="60px" height="0.9rem" />
                            <Skeleton width="60px" height="0.9rem" />
                        </div>
                        <div className="resumen__row precio__final__container">
                            <Skeleton width="50px" height="1rem" />
                            <Skeleton width="90px" height="1.25rem" />
                        </div>
                    </div>

                    <div className="vista__compra__card datos">
                        <Skeleton width="140px" height="1.1rem" style={{ marginBottom: 16 }} />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div className="dato__item" key={i}>
                                <Skeleton circle width={20} height={20} />
                                <Skeleton width="70%" height="0.85rem" />
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </>
    )
}