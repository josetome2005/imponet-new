import { useState, useEffect } from "react";
import { normalizeDateToISO } from "../services/dateUtils";

// ----- Utilidades puras ------------------------------------------------------------------

export function getAllInputs(formData) {
    if (!formData || !formData.sections) return []
    return formData.sections.flatMap(section => section.inputs);
}

function mapInputsInSections(sections, mapFn) {
    return sections.map(section => ({
        ...section,
        inputs: section.inputs.map(mapFn)
    }))
}

function normalizeDateInputs(inputs) {
    return inputs.map(input =>
        input.type === "date" && input.value
            ? { ...input, value: normalizeDateToISO(input.value) }
            : input
    );
}

export function normalizeToSections(data) {
    // Array de secciones directamente
    if (Array.isArray(data)) {
        return data.map(section => ({
            ...section,
            inputs: normalizeDateInputs(section.inputs)
        }));
    }

    // Ya tiene secciones
    if (data.sections) {
        return data.sections.map(section => ({
            ...section,
            inputs: normalizeDateInputs(section.inputs)
        }));
    }

    // Tiene inputs planos entonces los envuelvo en una sección
    return [{
        title: null,
        inputs: normalizeDateInputs(data.inputs)
    }];
}

export function shouldShowInput(item, formData) {
    if (!item.dependsOn || !item.showWhen) return true;
    const parent = getAllInputs(formData).find(i => i.name === item.dependsOn);
    return item.showWhen(parent?.value);
}

// ----- HOOK ------------------------------------------------------------------

export function useFormState(initialData, {persistOptions = false} = {}){

    const [formData, setFormData] = useState(() => {
        const sections = normalizeToSections(initialData);
        return {
            id: initialData?.id,
            options: initialData?.options ?? [],
            sections: sections.map(section => ({
                ...section,
                inputs: section.inputs.map(input => ({
                    ...input,
                    value: resolveDefaultValue(input)
                }))
            }))
        };
    });

    const allInputs = getAllInputs(formData);

    const mainCategory = allInputs.find(
        input => input.name == "main_category"
    )?.value

    // Filtra subcategorías cuando cambia la categoría principal
    useEffect(() => {
        if (!mainCategory) return;
        updateInputs(input => {
            if (input.name !== "subcategories") return input;
            return {
                ...input,
                value: (input.value || []).filter(sub => sub !== mainCategory)
            };
        });
    }, [mainCategory]);

    // ----- Helpers internos ------------------------------------------------------------------

    const updateInputs = (mapFn) => {
        setFormData(prev => ({
            ...prev,
            sections: mapInputsInSections(prev.sections, mapFn)
        }));
    };

    // ----- Handlers de Inputs ------------------------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateInputs(input =>
            input.name === name ? { ...input, value } : input
        );
    };

    const handleSelectOption = (option_selected, name_input) => {
        updateInputs(item => {
            if (item.name === name_input) return { ...item, value: option_selected.value };
            if (item.dependsOn === name_input) {
                const options = item.getOptions?.(option_selected.value) || item.options || [];
                return { ...item, value: options[0]?.value ?? "" };
            }
            return item;
        });
    };

    const handleCheckBoxToggle = (name_input, option) => {
        updateInputs(input => {
            if (input.name !== name_input) return input;
            const current = input.value || [];
            return {
                ...input,
                value: current.includes(option)
                    ? current.filter(v => v !== option)
                    : [...current, option]
            };
        });
    };

    const handlePermissionsChange = (name_input, module, permission) => {
        updateInputs(input => {
            if (input.name !== name_input) return input;
            return {
                ...input,
                value: {
                    ...input.value,
                    [module]: {
                        ...input.value[module],
                        [permission]: !input.value?.[module]?.[permission]
                    }
                }
            };
        });
    };

    const handleChangeSelectIcon = (name_input, value) => {
        updateInputs(input =>
            input.name === name_input
                ? { ...input, value: "/img/" + value }
                : input
        );
    };

    const handleChangeToggleInput = (newValue, name_input) => {
        updateInputs(input =>
            input.name === name_input
                ? { ...input, value: newValue }
                : input
        );
    };

    const handleChangeInputFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            file,
            sections: mapInputsInSections(prev.sections, input =>
                input.name === "file_name" ? { ...input, value: file.name } : input
            )
        }));
    };

    const handleChangeMoneyValue = (name_input, value) => {
               
        updateInputs(input =>
            input.name === name_input ? {...input, value} : input
        )
    }


    // ----- API del hook ---------------------------------------------------------

    return {
        formData,
        allInputs,
        mainCategory,
        handlers: {
            handleChange,
            handleSelectOption,
            handleCheckBoxToggle,
            handlePermissionsChange,
            handleChangeSelectIcon,
            handleChangeToggleInput,
            handleChangeInputFile,
            handleChangeMoneyValue
        }
    };
}

// ----- Helpers ----------------------------------------------------------------------

function buildEmptyPermissions(config) {
    return Object.fromEntries(
        Object.entries(config).map(([moduleKey, permissions]) => [
            moduleKey,
            Object.fromEntries(permissions.map(p => [p, false]))
        ])
    );
}

function resolveDefaultValue(input) {
    if (input.value !== undefined) return input.value;
    if (input.type === "flag_matrix") return buildEmptyPermissions(input.config);
    if (input.type === "boolean") return false;
    return "";
}
