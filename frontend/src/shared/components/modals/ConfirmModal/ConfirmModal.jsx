import { Button } from "../../ui/Button/Button";
import "./ConfirmModal.css"

export function ConfirmModal({message, onConfirm, onCancel}){

    if(!message){ 
        onCancel();
        return;
    }

    return(

        <div className="layout__modal__confirm">


            <div className="modal__confirm">
                
                <span className="material-symbols-outlined icon_close_modal" onClick={onCancel}>
                    close
                </span>

                <span className="title">Eliminar</span>
                <span className="message">{message}</span>

                <div className="buttons__container">
                    <Button
                        text={"Cancelar"}
                        onClick={onCancel}
                        mode={"grey"}
                    />
                    <Button
                        text={"Aceptar"}
                        onClick={onConfirm}
                        mode={"red"}
                    />
                </div>
            </div>

        </div>

    )

}