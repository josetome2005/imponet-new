import "./Skeleton.css"

export function Skeleton({
    width = "100%",
    height = "1rem",
    circle = false,
    radius = "8px",
    className = "",
    style = {}
}) {

    return(
        <span
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius: circle ? "50%" : radius,
                ...style,
            }}
        />
    )

}