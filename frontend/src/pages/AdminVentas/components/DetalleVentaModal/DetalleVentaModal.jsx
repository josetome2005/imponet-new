import "./DetalleVentaModal.css"
import { formatFecha } from "../../../../shared/services/dateUtils"
import { useScrollLock } from "../../../../shared/hooks/useScrollLock"
import { useEscapeKey } from "../../../../shared/hooks/useEscapeKey"
import { StatusLabel } from "../../../../shared/components/ui/StatusLabel/StatusLabel"
import { formatMoneda } from "../../../../shared/utils/formatMoneda"
import { Button } from "../../../../shared/components/ui/Button/Button"

const sections = [
    {
        title: "Cliente",
        items:[
            { name: "venta__nombre", label: "Nombre Cliente", mappedProp: "nombre" },
            { name: "venta__email", label: "Email", mappedProp: "email" },
            { name: "venta__telefono", label: "Teléfono", mappedProp: "telefono" },
        ]
    },
    {
        title: "Dirección",
        items: [
            { name: "venta__provincia", label: "Provincia", mappedProp: "direccion_provincia" },
            { name: "venta__ciudad", label: "Ciudad", mappedProp: "direccion_ciudad" },
            { name: "venta__calle", label: "Calle", mappedProp: "direccion_calle" },
            { name: "venta__cp", label: "Código Postal", mappedProp: "direccion_cp" },
        ]
    },
]
    



export function DetalleVentaModal({ venta, onClose, onEdit, onCancel }){

    useScrollLock()
    useEscapeKey(onClose)

    const info_sections = sections.map(s => 
        ({
            ...s,
            items: s.items.map(i => ({ ...i, value: venta[i?.mappedProp] }))
        })
       
    )
    

    
    
    return(
        <div className="detalle__venta__layout">

            <div className="detalle__modal">
                
                <div className="actions">
                    <span
                        className="material-symbols-outlined icon__close"
                        alt="Cerrar Vista"
                        onClick={onClose}
                    >
                        close
                    </span>
                </div>
                

                <div className="venta__titulo__container">
                    <div className="flex--16 y-center">
                        <h2 className="venta__titulo">Venta #{venta.codigo}</h2>
                        <StatusLabel
                            text={venta.estado}
                            status={venta.estado} />
                    </div>
                    <span className="venta__fecha">{formatFecha(venta.fecha).fecha_completa}</span>
                    
                </div>
                
                {
                    info_sections?.map(s => (
                        <div className="info__section">
                            <h3>{s.title}</h3>
                            <div className="items__container">
                                {
                                    s.items?.map(i => (
                                        <div key={i.name} className={`venta__item venta__item--${i.name}`}>
                                            <label>{i.label}</label>
                                            <span className="venta__item__value">{i.value}</span>
                                            
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    ))
                }

                <div className="info__section">
                    <h3>Productos</h3>
                    <table className="venta__productos__tabla">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>P. Unit.</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venta.detalle?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.producto_nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{formatMoneda("ARS").format(item.precio_unitario)}</td>
                                    <td>{formatMoneda("ARS").format(item.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3}>TOTAL</td>
                                <td>{formatMoneda("ARS").format(venta.total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {
                    venta.estado !== "cancelado" &&
                    <div className="buttons__container">
                        <Button
                            text={"Editar"}
                            onClick={() => onEdit(venta)} />
                        <Button
                            text={"Cancelar Venta"}
                            onClick={() => onCancel(venta)}
                            mode={"red"} />
                    </div>
                }
                
                
                    


            </div>

        </div>

    )
    

}