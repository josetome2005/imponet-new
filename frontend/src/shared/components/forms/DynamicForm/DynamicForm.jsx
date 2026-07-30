import "./DynamicForm.css"
import { useFormState } from "../../../hooks/useFormState"
import { useFormValidation } from "../../../hooks/useFormValidation";
import { FormRenderer } from "../FormRenderer/FormRenderer";

/**
 * DynamicForm — componente genérico embebible.
 *
 * Props:
 *   initialData   → misma estructura que antes (con inputs, sections, o sections[])
 *   onSubmit      → función que recibe el objeto construido con los valores del form
 *   onCancel      → opcional, si se pasa muestra el botón "Cancelar"
 *   submitLabel   → texto del botón principal (default: "Guardar")
 *   formMode      → "data" | "schema" | "entity"
 *   usesFiles     → boolean, activa el input de archivos
 *   persistOptions→ boolean, persiste opciones en BD al agregarlas (modo edición)
 *   flex          → boolean, permite items de 50% de ancho
 *   validateOnSubmit → boolean, activa validación de obligatorios (default: true)
 */
export function DynamicForm({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = "Guardar",
    formMode = "data",
    usesFiles = false,
    persistOptions = false,
    flex = false,
    validateOnSubmit = true,
    typeFile
}) {

    const { formData, allInputs, mainCategory, handlers } = useFormState(initialData, { persistOptions });
    const { isReadyToSend, error } = useFormValidation(formData, { usesFiles });

    const canSubmit = !validateOnSubmit || isReadyToSend;

    const buildPayload = () => {

        // Pequeño cambio de Estructura para los INFO MODULE
        if (formMode === "entity") {
            return {
                entity_id: formData.id,
                updates: allInputs.map(input => ({
                    field_id: input.id,
                    type: input.type,
                    value: input.value
                }))
            };
        }

        const payload = {
            id: formData.id,
            options: formData.options ?? [],
            ...allInputs.reduce((acc, input) => {
                if (input.mappedProp) acc[input.mappedProp] = input.value;
                return acc;
            }, {})
        };

        if (usesFiles && formData.file) {
            payload.file = formData.file;
            payload.fileName = formData.file.name;
        }

        return payload;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit(buildPayload());
        onCancel();
    };

    return (
        <form className="dynamic__form" onSubmit={handleSubmit}>

            {usesFiles && (
                <>
                    <label htmlFor="file" className="input__file__label">
                        <img src="/img/upload_666.png" alt="" />
                        <span>Arrastrá archivos aquí o hacé click para seleccionar</span>
                        <span className="button__select__file">
                            {formData.file ? formData.file.name : "No se seleccionó un archivo"}
                        </span>
                    </label>
                    <input type="file" accept={`${typeFile && typeFile === "img" ? ".png,.jpg,.jpeg,.webp" : ""}`} name="file" id="file" onChange={handlers.handleChangeInputFile} />
                </>
            )}

            <div className="form__inputs__container">
                <FormRenderer
                    formData={formData}
                    handlers={handlers}
                    mainCategory={mainCategory}
                    formMode={formMode}
                    flex={flex}
                />
            </div>

            {validateOnSubmit && error && (
                <span className="error">{error}</span>
            )}

            <div className="button__container">
                <button type="submit" className="submit__button" disabled={!canSubmit}>
                    {submitLabel}
                </button>
                {onCancel && (
                    <button type="button" className="exit__button" onClick={onCancel}>
                        Cancelar
                    </button>
                )}
            </div>

        </form>
    );
}