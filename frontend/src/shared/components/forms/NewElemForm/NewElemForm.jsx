import "./NewElemForm.css";
import { DynamicForm } from "../DynamicForm/DynamicForm";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { useEscapeKey } from "../../../hooks/useEscapeKey";

export function NewElemForm({ handleSubmit, handleExit, title, inputs, sections, usesFiles, typeFile, formMode, width = 38, flex = false }) {

    // Normalizo la entrada al mismo formato que espera DynamicForm
    const initialData = sections ? { sections } : { inputs };

    useScrollLock();
    useEscapeKey(handleExit);

    return (
        <div className="layout__form__new__elem">
            <div className="form__new__elem" style={{ width: width + "%" }}>
                
                <span 
                    className="material-symbols-outlined img__close__form" 
                    alt="Cerrar Formulario" 
                    onClick={handleExit}
                >
                    close
                </span>
                <h3>{title}</h3>

                <DynamicForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleExit}
                    submitLabel={usesFiles ? "Subir" : "Agregar"}
                    formMode={formMode}
                    usesFiles={usesFiles}
                    flex={flex}
                    typeFile={typeFile}
                    validateOnSubmit={true}
                />

            </div>
        </div>
    );
}