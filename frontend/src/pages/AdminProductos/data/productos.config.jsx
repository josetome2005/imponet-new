export const searchFields = [
    "nombre",
    "sku"
]

export const filters = [
    {
        field: "activo",
        options: [
            {
                filter: "todos",
                filters: "",
                label: "Todos"
            },
            {
                filter: 1,
                filterResult: 1,
                label: "Activo"
            },
            {
                filter: 0,
                filterResult: 0,
                label: "Inactivo"
            },
        ]
    },  
]

export const productos_columns = [
    {   
        key: "nombre",
        name: "Producto",
        render: (p) => (
            <div className="flex--8 y-center nombre__producto__container">
                <span className="material-symbols-outlined icon">
                    package_2
                </span>
                <span className="nombre__producto">{p.nombre}</span>
            </div>
        )
    },
    {
        key: "sku",
        name: "SKU",
        render: p => (
            <span className="sku__producto">{p.sku}</span>
        )
    },
    {
        key: "marca",
        name: "MARCA",
        render: p => (
            <span className="marca__producto">{p.marca_nombre}</span>
        )
    },
    {
        key: "precio",
        name: "PRECIO",
        render: p => (
            <span className="precio__producto">{parsePrecio(p.precio)}</span>
        )
    },
    {
        key: "stock",
        name: "STOCK",
        render: p => (
            <span className="stock__producto">{p.stock}</span>
        )
    },
    {
        key: "activo",
        name: "ESTADO",
        render: p => (
            <span className={`estado__producto ${p.activo ? "activo" : "inactivo"}`}>{p.activo ? "Activo" : "Inactivo"}</span>
        )
    },
    {
        key: "actions",
        name: "",
        render: p => (
            <div className="flex--16 y-center actions__container">
                <span className="material-symbols-outlined icon edit__icon">
                    edit
                </span>
                <span className="material-symbols-outlined icon delete__icon">
                    delete
                </span>
            </div>
        )
    },
    
]

function parsePrecio(precio){
    return precio.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
    });
}