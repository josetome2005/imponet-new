import { useEffect, useState } from "react"
import { getDashboardResumen } from "../../../shared/services/dashboard.services"


export function useDashboardData(){
    const [resumen, setResumen] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const data = await getDashboardResumen()
                setResumen(data)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return { resumen, loading }
    

}