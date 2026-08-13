import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { searchProductos } from "../services/productos.services";

export function useSearchProductos(query, { limit = 5, delay = 350 } = {}){

    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const debounceRef = useRef(null)

    useEffect(() => {

        clearTimeout(debounceRef.current);

        if(!query || query.trim().length < 2){
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try{
                const data = await searchProductos({ q: query, limit })
                setResults(data)
            }finally{
                setLoading(false);
            }

        }, delay)

        return () => clearTimeout(debounceRef.current)

    }, [query, limit, delay])

    return {
        results, 
        loading
    }

}