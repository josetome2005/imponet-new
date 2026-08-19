// components/ProductoForm/ProductoForm.jsx
import { useState } from "react";
import "./ProductoForm.css";
import { FormRenderer } from "../../../../shared/components/forms/FormRenderer/FormRenderer";
import { ProductoImagesManager } from "../ProductoImagesManager/ProductoImagesManager";
import { useFormState } from "../../../../shared/hooks/useFormState";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";
import { useScrollLock } from "../../../../shared/hooks/useScrollLock";
import { useEscapeKey } from "../../../../shared/hooks/useEscapeKey";

export function ProductoForm({ title, inputsConfig, editingElem, onSubmit, onExit, isSubmitting }) {

    useScrollLock();
    useEscapeKey(onExit);

    const initialData = editingElem
        ? {
            id: editingElem.id,
            inputs: inputsConfig.map((input) => {
                let value = editingElem[input.mappedProp];

                if (input.mappedProp === "categoria_ids") {
                    value = editingElem.categorias?.map((c) => c.id) ?? [];
                }
                if (input.type === "boolean") {
                    value = Boolean(value);
                }

                return { ...input, value };
            })
        }
        : { id: null, inputs: inputsConfig };

    const { formData, allInputs, mainCategory, handlers } = useFormState(initialData, { persistOptions: true });
    const { isReadyToSend, error } = useFormValidation(formData, { usesFiles: false });

    const [imageData, setImageData] = useState({ imagenesOrden: null, archivosNuevos: [] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isReadyToSend) return;

        const fields = {
            id: formData.id,
            ...allInputs.reduce((acc, input) => {
                if (input.mappedProp) acc[input.mappedProp] = input.value;
                return acc;
            }, {})
        };

        await onSubmit({
            fields,
            imagenesOrden: imageData.imagenesOrden,
            archivosNuevos: imageData.archivosNuevos
        });
        onExit();
    };

    return (
        <div className="layout__form__edit__elem">
            <div className="form__edit__elem producto__form" style={{ width: "50%" }}>

                <span className="material-symbols-outlined img__close__form" onClick={onExit}>close</span>
                <h3>{title}</h3>

                <form onSubmit={handleSubmit}>

                    <ProductoImagesManager
                        initialImages={editingElem?.imagenes ?? []}
                        onChange={setImageData}
                    />

                    <div className="form__inputs__container">
                        <FormRenderer
                            formData={formData}
                            handlers={handlers}
                            mainCategory={mainCategory}
                            formMode="data"
                            flex={true}
                        />
                    </div>

                    {error && <span className="error">{error}</span>}

                    <div className="button__container">
                        <button type="submit" className="submit__button" disabled={!isReadyToSend ||isSubmitting}>
                            {isSubmitting ? "Guardando" : "Guardar"}
                        </button>
                        <button type="button" className="exit__button" onClick={onExit}>
                            Cancelar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}