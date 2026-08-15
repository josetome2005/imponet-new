// hooks/useProductosCRUD.js
import { useState, useEffect } from "react";
import { useConfirm } from "./useConfirm";
import { useToast } from "../components/toast/ToastContext";
import { getProductosAdmin, createProducto, updateProducto, deleteProducto } from "../services/productos.services";

export function useProductosCRUD() {
    const [productos, setProductos] = useState([]);
    const [pagination, setPagination] = useState(null)
    const [page, setPage] = useState(1)
    const [showNewForm, setShowNewForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingElem, setEditingElem] = useState(null);

    const { state, confirm, handleCancel, handleConfirm } = useConfirm();
    const toast = useToast();

    useEffect(() => {
        async function fetchAll() {
            const {productos: data, pagination: pag} = await getProductosAdmin({ page, perPage: 10 });
            setProductos(data);
            console.log(pag)
            setPagination(pag)
        }   
        fetchAll();
    }, [page, setPagination]);

    const openNewForm = () => setShowNewForm(true);
    const closeNewForm = () => setShowNewForm(false);

    const openEditForm = (producto) => {
        setEditingElem(producto);
        setShowEditForm(true);
    };
    const closeEditForm = () => {
        setShowEditForm(false);
        setEditingElem(null);
    };

    const handleDelete = async (id) => {
        const ok = await confirm("Esta acción no se puede deshacer. ¿Estás seguro que querés eliminar este producto?");
        if (!ok) return;

        const index = productos.findIndex((p) => p.id === id);
        if (index === -1) return;
        const removed = productos[index];

        setProductos((prev) => prev.filter((p) => p.id !== id));

        try {
            await deleteProducto(id);
            toast.success("Se ha eliminado el producto correctamente.");
        } catch (e) {
            console.error(e);
            setProductos((prev) => [...prev.slice(0, index), removed, ...prev.slice(index)]);
            toast.error("Ha ocurrido un error al eliminar el producto.");
        }
    };

    // { fields, imagenesOrden, archivosNuevos } viene de ProductoForm
    const handleSubmitNew = async ({ fields, archivosNuevos }) => {
        try {
            const nuevo = await createProducto({ object: fields, imagenes: archivosNuevos });
            setProductos((prev) => [...prev, nuevo]);
            toast.success("Se ha creado el producto correctamente.");
        } catch (e) {
            console.error(e);
            toast.error("Ha ocurrido un error al crear el producto.");
        }
    };

    const handleSubmitEdit = async ({ fields, imagenesOrden, archivosNuevos }) => {
        const { id, ...rest } = fields;
        try {
            const updated = await updateProducto({ id, object: rest, imagenesOrden, archivosNuevos });
            setProductos((prev) => prev.map((p) => (p.id === id ? updated : p)));
            toast.success("Se ha editado el producto correctamente.");
        } catch (e) {
            console.error(e);
            toast.error("Ha ocurrido un error al editar el producto.");
        }
    };

    const handleChangePage = (nuevaPage) => {
        setPage(nuevaPage)
    }

    return {
        productos,
        showNewForm,
        showEditForm,
        editingElem,
        confirmState: state,
        handleCancel,
        handleConfirm,
        openNewForm,
        closeNewForm,
        openEditForm,
        closeEditForm,
        handleDelete,
        handleSubmitNew,
        handleSubmitEdit,
        pagination,
        handleChangePage
    };
}