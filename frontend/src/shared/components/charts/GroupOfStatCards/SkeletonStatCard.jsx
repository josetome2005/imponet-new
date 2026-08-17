// shared/components/charts/GroupOfStatCards/SkeletonStatCard.jsx
import { Skeleton } from "../../ui/Skeleton/Skeleton"
import "./GroupOfStatCards.css" // reusa la clase .stat-card real

export function SkeletonStatCard() {
  return (
    <div className="statCard">
        <div style={{ justifyContent: "space-between"  }} className="flex--2 y-center">
             <Skeleton
                circle
                width={24}
                height={24}
                style={{ position: "absolute", top: 24, right: 24 }}
            />

            {/* statCard__title: font-size 14px */}
            <Skeleton width="50%" height="14px" />
        </div>
     

      {/* statCard__stat: font-size 24px, line-height 32px, margin-top 7 */}
      <Skeleton width="35%" height="24px" style={{ marginTop: 7, marginBottom: 3 }} />

      {/* statCard__description: font-size 12px */}
      <Skeleton width="70%" height="12px" />
    </div>
  )
}

export function SkeletonGroupOfStatCards({ count = 4 }) {
  return (
    <div className="statCards__container">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  )
}