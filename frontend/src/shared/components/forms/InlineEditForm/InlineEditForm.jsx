import { DynamicForm } from "../DynamicForm/DynamicForm";
import { DataView } from "../DataView/DataView";

// InlineEditForm — solo presentación
export function InlineEditForm({ initialData, onSubmit, isEditing, onEdit, onCancel, formMode, flex }) {

    if (!isEditing) {
        return <DataView initialData={initialData} onEdit={onEdit}/>;
    }

    return (
        <DynamicForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitLabel="Guardar"
            formMode={formMode}
            flex={flex}
            validateOnSubmit={false}
        />
    );
}