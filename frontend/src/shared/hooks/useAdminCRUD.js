import { useState, useEffect } from "react";
import { useConfirm } from "./useConfirm";
import { useToast } from "../components/toast/ToastContext";
import { useLocalTableData } from "./useLocalTableData";

export function useAdminCRUD({
    getAll,
    create,
    update,
    remove,
    entityName,
    inputsConfig,
    
    searchFields,
    filters,
    initialFilter,
    tabs,
    initialTab
}){


    const [items, setItems] = useState([])
    const [showNewElemForm, setShowNewElemForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [editingElem, setEditingElem] = useState(null)

    const { state, confirm, handleCancel, handleConfirm } = useConfirm()
    const toast = useToast()

    const fetchAll = async () => {
        const data = await getAll()
        setItems(data)
    }

    useEffect(() => {
        fetchAll()
    }, [])

    const table = useLocalTableData(
        items, 
        {  
            searchFields,
            filters,
            initialFilter,
            tabs,
            initialTab,
            perPage: 10
        })

    const openNewForm = () => setShowNewElemForm(true)
    const closeNewForm = () => setShowNewElemForm(false)
    const closeEditForm = () => {
        setShowEditForm(false)
        setEditingElem(null)
    }

    const handleDelete = async (id) => {
        const ok = await confirm(`Esta acción no se puede deshacer. ¿Estás seguro que quieres eliminar esta ${entityName}?`)
        if (!ok) return;

        const index = items.findIndex(it => it.id === id)
        if (index === -1) return;

        const removedItem = items[index]

        setItems(prev => prev.filter(it => it.id !== id))

        try {
            await remove(id)
            toast.success(`Se ha eliminado la ${entityName} correctamente.`)
        } catch (e) {
            console.log(e)
            setItems(prev => [
                ...prev.slice(0, index),
                removedItem,
                ...prev.slice(index)
            ])
            toast.error(e.message ?? `Ha ocurrido un error al eliminar la ${entityName}.`)
        }
    }

    // Cancela: el item se queda en la lista, solo cambia de estado (ventas)
    const handleCancelItem = async (id, mensajeConfirm) => {
        const ok = await confirm(
            mensajeConfirm ?? `Esta acción no se puede deshacer. ¿Estás seguro que querés cancelar esta ${entityName}?`
        )
        if (!ok) return;

        const index = items.findIndex(it => it.id === id)
        if (index === -1) return;

        try {
            const updated = await remove(id) // remove = cancelarVenta, devuelve la venta ya actualizada
            setItems(prev => prev.map(it => it.id === id ? { ...it, ...updated } : it))
            toast.success(`Se ha cancelado la ${entityName} correctamente.`)
        } catch (e) {
            console.log(e)
            toast.error(e.message ?? `Ha ocurrido un error al cancelar la ${entityName}.`)
        }
    }

    const handleRequestEdit = (elem) => {
        setEditingElem({
            id: elem.id ?? "",
            inputs: inputsConfig.map(input => ({
                ...input,
                value: elem[input.mappedProp]
            }))
        })
        setShowEditForm(true)
    }

    const handleSubmitEdit = async (formData) => {
        const { id, ...rest } = formData

        try {
            const updated = await update({ id, ...rest })
            setItems(prev => prev.map(it =>
                it.id === id ? { ...it, ...rest, ...updated } : it
            ))
            toast.success(`Se ha editado la ${entityName} correctamente.`)
        } catch (e) {
            console.log(e)
            toast.error(e.message ?? `Ha ocurrido un error al editar la ${entityName}.`)
        }
    }

    const handleSubmitNew = async (formData) => {
        try {
            const nuevoItem = await create(formData)
            setItems(prev => [...prev, nuevoItem])
            toast.success(`Se ha creado la ${entityName} correctamente.`)
        } catch (e) {
            toast.error(e.message ?? `Ha ocurrido un error creando la ${entityName}.`)
        }
    }


    return {
        // CRUD
        items: table.data,
        showNewElemForm,
        showEditForm,
        editingElem,
        confirmState: state,
        handleCancel,
        handleConfirm,
        openNewForm,
        closeNewForm,
        closeEditForm,
        handleDelete,
        handleCancelItem,
        handleRequestEdit,
        handleSubmitEdit,
        handleSubmitNew,
        // Table
        search: table.search,
        setSearch: table.setSearch,
        activeTab: table.activeTab,
        setActiveTab: table.setActiveTab,
        filterGroups: table.filterGroups,
        isFiltering: table.isFiltering,
        pagination: table.pagination,
        setPage: table.setPage,
    }

    


}