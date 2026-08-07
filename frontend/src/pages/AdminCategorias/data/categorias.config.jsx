export const searchFields = [
    "nombre",
]

export const categorias_columns = (onEdit, onDelete) => [
    {
        key: "nombre",
        name: "CATEGORÍA",
        render: (c) => (
            <div className="flex--8 y-center nombre__categoria__container">
                <span className="material-symbols-outlined icon">
                    stacks
                </span>
                <span className="nombre__categoria">{c.nombre}</span>
            </div>
        )
    },
    {
        key: "cantidad_productos",
        name: "PRODUCTOS",
    },
    {
        key: "actions",
        name: "",
        render: (p) => (
            <div className="flex--16 y-center actions__container">
                <span className="material-symbols-outlined icon edit__icon" onClick={() => onEdit(p)} title="Editar">
                    edit
                </span>
                <span className="material-symbols-outlined icon delete__icon" onClick={() => onDelete(p.id)} title="Eliminar">
                    delete
                </span>
            </div>
        )
    },

]
