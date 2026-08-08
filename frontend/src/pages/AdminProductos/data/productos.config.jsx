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

export const buildProductosColumns = ({onEdit, onDelete}) => [
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
        key: "actions__container",
        name: "",
        render: p => (
            <div className="flex--16 y-center actions__container">
                <span className="material-symbols-outlined icon edit__icon" onClick={() => onEdit(p)}>
                    edit
                </span>
                <span className="material-symbols-outlined icon delete__icon" onClick={() => onDelete(p.id)}>
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

export const buildProductoInputs = ({ marcas, categorias }) => [
    { id: "nombre", name: "nombre", type: "text", label: "Nombre", mappedProp: "nombre", is_mandatory: true },
    { id: "sku", name: "sku", type: "text", label: "SKU", mappedProp: "sku" },
    { id: "precio", name: "precio", type: "number", label: "Precio", mappedProp: "precio", is_mandatory: true },
    { id: "descuento", name: "descuento", type: "number", label: "Descuento (%)", mappedProp: "descuento" },
    { id: "descripcion", name: "descripcion", type: "textarea", label: "Descripción", mappedProp: "descripcion", width: "100" },
    { id: "stock", name: "stock", type: "number", label: "Stock", mappedProp: "stock", is_mandatory: true },
    {
        id: "marca_id", name: "marca_id", type: "select", label: "Marca", mappedProp: "marca_id",
        options: marcas.map((m) => ({ label: m.nombre, value: m.id })),
    },
    {
        id: "categoria_ids", name: "categoria_ids", type: "checkbox_list", label: "Categorías", mappedProp: "categoria_ids",
        options: categorias.map((c) => ({ label: c.nombre, value: c.id })),
        width: "100"
    },
    { id: "activo", name: "activo", type: "boolean", label: "Producto activo", mappedProp: "activo" }
]