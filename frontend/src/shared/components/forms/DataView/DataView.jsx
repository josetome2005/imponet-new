import "./DataView.css"
import { normalizeToSections, shouldShowInput } from "../../../hooks/useFormState";
import { ToggleInput } from "../inputs/ToggleInput/ToggleInput";

function renderValue(item) {
    switch (item.type) {
        case "select":
            return item.options?.find(o => o.value === item.value)?.label ?? "—";

        case "boolean":
            return (
                <ToggleInput
                    input_name={item.name}
                    value={item.value}
                    disabled={true}
                    onChange={() => { }}
                />
            );

        default:
            return item.value || "—";
    }
}

export function DataView({ initialData, onEdit, flex }) {
    const sections = normalizeToSections(initialData);
    const fakeFormData = { sections };

    return (
        <div className="data__view">

            {sections.map((section, index) => (
                <div key={index} className="form__section">

                    {section.title && (
                        <h4 className="form__section__title">{section.title}</h4>
                    )}

                    <div className="form__section__inputs">
                        {section.inputs
                            .filter(item => shouldShowInput(item, fakeFormData))
                            .map(item => {
                                const width = item.width ? item.width : flex ? 50 : 100;
                                const isToggleInput = item.type === "boolean"

                                return (
                                    <div key={item.name} className={`form__item form__item--${width} ${isToggleInput ? "boolean" : ""}`}>
                                        <label className="data__view__label">{item.label}</label>
                                        <span className="data__view__value">{renderValue(item)}</span>
                                    </div>
                                );
                            })
                        }
                    </div>

                </div>
            ))}

            <div className="button__container">
                <button type="button" className="button__to__edit" onClick={onEdit}>
                    <img src="/img/edit_333.png" alt="Editar" title="Editar" />
                    Editar
                </button>
            </div>

        </div>
    );
}