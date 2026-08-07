import "./FormRenderer.css"

import { SelectInput } from "../inputs/SelectInput/SelectInput";
import { ListOfCheckOptions } from "../inputs/ListOfCheckOptions/ListOfCheckOptions";
import { FlagMatrix } from "../inputs/FlagMatrix/FlagMatrix";
import { SelectIcon } from "../inputs/SelectIcon/SelectIcon";
import { ToggleInput } from "../inputs/ToggleInput/ToggleInput";

import { shouldShowInput } from "../../../hooks/useFormState";
import { MoneyInput } from "../inputs/MoneyInput/MoneyInput";

const getInputOptions = (item, formData) => {

    if (!item.dependsOn) return item.options || [];

    const allInputs = formData.sections?.flatMap(section => section.inputs) || [];

    const parentValue = allInputs.find(
        i => i.name === item.dependsOn
    )?.value;

    return item.getOptions?.(parentValue) || item.options || [];
};

export function FormRenderer({ formData, handlers, mainCategory, formMode, flex = false }) {

    const {
        handleChange,
        handleSelectOption,
        handleCheckBoxToggle,
        handlePermissionsChange,
        handleChangeSelectIcon,
        handleChangeToggleInput,
        handleChangeMoneyValue
    } = handlers;

    const INPUTS_COMPONENTS = {
        "select": (item) =>
            <SelectInput
                name_input={item.name}
                activeOption={item.value}
                options={getInputOptions(item, formData)}
                onSelect={handleSelectOption}
                disabled={item.disabled ?? false}
                messageNoOptions={item.message_no_options}
                canAddOptions={item.canAddOptions ?? false}
            />,

        "checkbox_list": (item) =>
            <ListOfCheckOptions
                name_input={item.name}
                checkedOptions={item.value}
                options={item.options.filter(option => option.value !== mainCategory)}
                onToggle={handleCheckBoxToggle}
            />,

        "flag_matrix": (item) =>
            <FlagMatrix
                name_input={item.name}
                value={item.value}
                config={item.config}
                columns={item.columns}
                rows={item.rows}
                onChange={handlePermissionsChange}
            />,

        "select_icon": (item) =>
            <SelectIcon
                name_input={item.name}
                value={item.value}
                options={item.options}
                onChange={handleChangeSelectIcon}
            />,

        "boolean": (item) =>
            <ToggleInput
                input_name={item.name}
                value={item.value ?? false}
                onChange={handleChangeToggleInput}
            />,

        "money": (item) =>
            <MoneyInput
                name_input={item.name}
                value={item.value ?? "ARG$"}
                onChange={handleChangeMoneyValue}
            />,

        "textarea": (item) =>
            <textarea name={item.name} onChange={handleChange}>{item.value}</textarea>
    };

    const renderControl = (item) => {
        const Component = INPUTS_COMPONENTS[item.type];
        return Component
            ? Component(item)
            : <input type={item.type} name={item.name} value={item.value} onChange={handleChange} />;
    };

    const renderInput = (item) => {

        if (!shouldShowInput(item, formData)) return null;

        const width = 
            item.width 
                ? item.width
                : flex 
                    ? 50
                    : 100

        const width_class = "form__item--" + width

        const is_mandatory = item.is_mandatory ? true : false

        return (
            <div key={item.name} className={`form__item ${width_class}`}>
                <label>
                    {item.label}
                    {is_mandatory && <span className="mandatory_mark"> *</span>}
                </label>

                {renderControl(item)}
            </div>
        );
    };

    return (
        <>
            {formData.sections.map((section, index) => (
                <div key={index} className="form__section">
                    {section.title && (
                        <h4 className="form__section__title">{section.title}</h4>
                    )}
                    <div className="form__section__inputs">
                        {section.inputs.map(renderInput)}
                    </div>
                </div>
            ))}
        </>
    );
}