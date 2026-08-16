import { formatFecha } from "../../../shared/services/dateUtils"

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

export const buildNewsletterColumns = ({onDarDeBaja}) => [
    {   
        key: "email",
        name: "Email",
        render: (s) => (
            <div className="flex--8 y-center email__suscriptor__container">
                <span className="material-symbols-outlined icon">
                    person
                </span>
                <span className="email__suscriptor">{s.email}</span>
            </div>
        )
    },
    {
        key: "fecha",
        name: "FECHA",
        render: s => (
            <span className={`fecha__suscriptor`}>{formatFecha(s.created_at).fecha_completa}</span>
        )
    },
    {
        key: "activo",
        name: "ESTADO",
        render: s => (
            <span className={`estado__suscriptor ${s.activo ? "activo" : "inactivo"}`}>{s.activo ? "Activo" : "Inactivo"}</span>
        )
    },
    {
        key: "actions__container",
        name: "",
        render: s => (
            <>
                {s.activo > 0 && 
                    <div className="flex--16 y-center actions__container">
                        <span className="material-symbols-outlined icon edit__icon" onClick={() => onDarDeBaja(s.email)}>
                            cancel
                        </span>
                    </div>
                }
                
            </>
            
        )
    },
    
]

