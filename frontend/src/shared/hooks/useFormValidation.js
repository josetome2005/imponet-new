import { useState, useEffect } from "react";
import { getAllInputs, shouldShowInput } from "./useFormState"

export function useFormValidation(formData, { usesFiles = false } = {}) {

    const [isReadyToSend, setIsReadyToSend] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const allInputs = getAllInputs(formData);

        const allFilled = allInputs
            .filter(input => shouldShowInput(input, formData))
            .filter(input => input.is_mandatory)
            .every(input => {
                if (input.type === "checkbox_list") {
                    return Array.isArray(input.value) && input.value.length > 0;
                }

                if (input.type === "boolean") {
                    return typeof input.value === "boolean";
                }

                return input.value !== undefined && input.value !== "";
            });

        const fileValid = usesFiles ? !!formData.file : true;

        const isValid = allFilled && fileValid;

        setIsReadyToSend(isValid);
        setError(isValid ? "" : "Debe completar correctamente todos los campos");

    }, [formData, usesFiles]);

    return { isReadyToSend, error };
}