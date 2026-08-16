import { Footer } from "../../shared/components/layout/Footer/Footer"
import { Header } from "../../shared/components/layout/Header/Header"
import { useNavigate, useSearchParams } from "react-router-dom"
import { SelectOption } from "../../shared/components/forms/inputs/SelectOption/SelectOption"
import "./Productos.css"
import { useEffect, useState } from "react"
import { searchProductos } from "../../shared/services/productos.services"
import { ProductoItem } from "../../shared/components/items/ProductoItem/ProductoItem"
import { getMarcasConCantidad } from "../../shared/services/marcas.services"
import { getCategoriasConCantidad } from "../../shared/services/categorias.services"
import { FiltersSidebar } from "./components/FilterSidebar/FilterSidebar"
import { Pagination } from "../../shared/components/ui/Pagination/Pagination"

const order_options = [
    {
        id: crypto.randomUUID(),
        label: "Menor Precio",
        value: "menor-precio"
    },
    {
        id: crypto.randomUUID(),
        label: "Mayor Precio",
        value: "mayor-precio"
    },
    {
        id: crypto.randomUUID(),
        label: "Nombre Asc",
        value: "nombre-asc"
    },
    {
        id: crypto.randomUUID(),
        label: "Nombre Desc",
        value: "nombre-desc"
    },
]


export function Productos(){
    
    const [searchParams] = useSearchParams()
    const [activeOrderOption, setActiveOrderOption] = useState()
    const [productos, setProductos] = useState([])
    const [pagination, setPagination] = useState(null)
    const [loading, setLoading] = useState(false)

    const [marcasDisponibles, setMarcasDisponibles] = useState([])
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchFiltros() {
            const [{items: m}, {items: c}] = await Promise.all([getMarcasConCantidad(), getCategoriasConCantidad()]);
            setMarcasDisponibles(m);
            setCategoriasDisponibles(c);
        }
        fetchFiltros();
    }, []);

    const handleApplyFilters = ({ marca, categoria, precioMin, precioMax }) => {
        const params = new URLSearchParams(searchParams);
        marca.length ? params.set("marca", marca.join(",")) : params.delete("marca");
        categoria.length ? params.set("categoria", categoria.join(",")) : params.delete("categoria");
        precioMin ? params.set("precioMin", precioMin) : params.delete("precioMin");
        precioMax ? params.set("precioMax", precioMax) : params.delete("precioMax");
        params.set("page", "1");
        navigate(`/productos?${params.toString()}`);
    };
    
    const marca = searchParams.get("marca")
    const categoria = searchParams.get("categoria")
    const precioMin = searchParams.get("precioMin");
    const precioMax = searchParams.get("precioMax");
    const q = searchParams.get("q")
    const page = searchParams.get("page") ?? 1

    useEffect(() => {
        async function fetchProductos(){
            setLoading(true)
            try{
                const { productos: data, pagination: pag} = await searchProductos({
                    q,
                    marca,
                    categoria,
                    precioMin,
                    precioMax,
                    orden: activeOrderOption,
                    page
                })
                setProductos(data)
                setPagination(pag)
            }finally{
                setLoading(false)
            }
        }

        fetchProductos()
    }, [q, marca, categoria, activeOrderOption, precioMax, precioMin, page])

    const handleChangeOrder = (item) => {
        setActiveOrderOption(item.value);
        const params = new URLSearchParams(searchParams)
        params.set("page", "1")
        navigate(`/productos?${params.toString()}`)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const irAPagina = (nuevaPagina) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", nuevaPagina)
        navigate(`/productos?${params.toString()}`)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    /*------------------------------------------------------------------*/

    const marcaSlugs = marca ? marca.split(",") : []
    const categoriaSlugs = categoria ? categoria.split(",") : []

    const nombresMarcas = marcasDisponibles
        .filter((m) => marcaSlugs.includes(m.slug))
        .map((m) => m.nombre)

    const nombresCategorias = categoriasDisponibles
        .filter((c) => categoriaSlugs.includes(c.slug))
        .map((c) => c.nombre)

    const formatList = (nombres) => {
        if (nombres.length === 0) return null
        if (nombres.length === 1) return nombres[0]
        if (nombres.length === 2) return `${nombres[0]} y ${nombres[1]}`
        return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
    }

    const titulo = q
        ? `Resultados para "${q}"`
        : formatList(nombresCategorias) ?? formatList(nombresMarcas) ?? "Todos los productos"



    return(

        <>
            <Header />

            <div className="productos">

                <div className="productos__header">
                    <h3>{titulo}</h3>

                    <div className="select__order">
                        <span>Ordenar por: </span>
                        <div className="select__container">
                            <SelectOption 
                                name_input={"order"}
                                activeOption={activeOrderOption}
                                options={order_options}
                                defaultText={"Seleccionar"}
                                onSelect={handleChangeOrder}
                                />
                        </div>
                    </div>
                </div>  

                <div className="productos__layout">
                    
                    <FiltersSidebar
                        marcas={marcasDisponibles}
                        categorias={categoriasDisponibles}
                        initialFilters={{
                            marca: marca ? marca.split(",") : [],
                            categoria: categoria ? categoria.split(",") : [],
                            precioMin,
                            precioMax
                        }}
                        onApply={handleApplyFilters}
                        onClean={() => navigate("/productos")}
                    />

                    <div className="searched__productos__container">
                        <div className="catalogo__container">
                            {
                                productos.map(p =>
                                    <ProductoItem
                                        key={p.id}
                                        producto={p} />
                                )
                            }
                        </div>
                        <Pagination 
                            pagination={pagination}
                            onPageChange={irAPagina}/>
                    </div>
                    

                </div>

            </div>

            <Footer/>
        </>

    )

}