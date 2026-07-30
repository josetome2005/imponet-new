import "./EditForm.css";
import { DynamicForm } from "../DynamicForm/DynamicForm";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { useEscapeKey } from "../../../hooks/useEscapeKey";

export function EditForm({ title, editingElem, onSubmit, onExit, mode, width = 38, flex = false }) {

    useScrollLock();
    useEscapeKey(onExit);

    return (
        <div className="layout__form__edit__elem">
            <div className="form__edit__elem" style={{ width: width + "%" }}>

                <img src="/img/close_333.png" className="img__close__form" alt="Cerrar Formulario" onClick={onExit} />
                <h3>{title}</h3>

                <DynamicForm
                    initialData={editingElem}
                    onSubmit={onSubmit}
                    onCancel={onExit}
                    submitLabel="Guardar"
                    formMode={mode ?? "data"}
                    persistOptions={true}
                    flex={flex}
                    validateOnSubmit={false}
                />

            </div>
        </div>
    );
}