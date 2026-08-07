// components/ProductoImagesManager/ProductoImagesManager.jsx
import { useState, useRef } from "react";
import "./ProductoImagesManager.css";

// item: { key, type: "existing" | "new", url (preview), file? (solo si es "new"), sourceUrl? (solo si es "existing") }

export function ProductoImagesManager({ initialImages = [], onChange }) {
    const [items, setItems] = useState(() =>
        initialImages.map((img) => ({
            key: img.url,
            type: "existing",
            url: img.url,       // acá asumo que es la URL absoluta o relativa servible, ej /uploads/productos/x.jpg
            sourceUrl: img.url
        }))
    );

    const dragItemIndex = useRef(null);

    const emitChange = (newItems) => {
        setItems(newItems);
        const imagenesOrden = newItems.map((it) => (it.type === "existing" ? it.sourceUrl : "NEW"));
        const archivosNuevos = newItems.filter((it) => it.type === "new").map((it) => it.file);
        onChange({ imagenesOrden, archivosNuevos });
    };

    const handleAddFiles = (fileList) => {
        const nuevos = Array.from(fileList).map((file) => ({
            key: `${file.name}-${file.lastModified}-${Math.random()}`,
            type: "new",
            url: URL.createObjectURL(file),
            file
        }));
        emitChange([...items, ...nuevos]);
    };

    const handleRemove = (key) => {
        const target = items.find((it) => it.key === key);
        if (target?.type === "new") URL.revokeObjectURL(target.url);
        emitChange(items.filter((it) => it.key !== key));
    };

    const handleDragStart = (index) => {
        dragItemIndex.current = index;
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        const from = dragItemIndex.current;
        if (from === null || from === index) return;

        const reordered = [...items];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(index, 0, moved);
        dragItemIndex.current = index;
        setItems(reordered);
    };

    const handleDragEnd = () => {
        dragItemIndex.current = null;
        emitChange(items);
    };

    return (
        <div className="producto__images__manager">
            <label htmlFor="producto-imagenes-input" className="images__dropzone">
                <span className="material-symbols-outlined">add_photo_alternate</span>
                <span>Agregar imágenes</span>
            </label>
            <input
                id="producto-imagenes-input"
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                multiple
                hidden
                onChange={(e) => {
                    if (e.target.files?.length) handleAddFiles(e.target.files);
                    e.target.value = ""; // permite volver a elegir el mismo archivo después
                }}
            />

            <div className="images__grid">
                {items.map((item, index) => (
                    <div
                        key={item.key}
                        className="image__item"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <img src={item.url} alt="" />
                        {item.type === "new" && <span className="badge__new">Nueva</span>}
                        <button
                            type="button"
                            className="image__remove"
                            onClick={() => handleRemove(item.key)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}