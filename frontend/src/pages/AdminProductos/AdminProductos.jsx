import "./AdminProductos.css"
import { useEffect, useState } from "react"
import { SectionTitle } from "../../shared/components/ui/SectionTitle/SectionTitle"
import { TableContainer } from "../../shared/components/table/TableContainer/TableContainer"
import { getProductosAdmin, getProductos } from "../../shared/services/productos.services"
import { searchFields, filters, productos_columns } from "./data/productos.config"

export function AdminProductos() {

    const [productos, setProductos] = useState([])

    useEffect(() => {
        async function getProds() {
            try {
                const prods = await getProductosAdmin();
                setProductos(prods);
            } catch (error) {
                console.error(error);
            }
        }
    
        getProds();
    }, []);
    
    return (

        <div className="admin__section admin__productos">
            <SectionTitle 
                title={"Productos"}
                subtitle={`${productos.length} productos en tu catálogo.`}
                buttonText={"Nuevo Producto"}/>

            <TableContainer 
                data={productos}
                columns={productos_columns}
                searchFields={searchFields}
                filters={filters}
                placeholderInput={"Buscar por nombre o SKU"}
                messageNoSearch={"Aún no tienes cargados productos"}
            />
        </div>
    )

}