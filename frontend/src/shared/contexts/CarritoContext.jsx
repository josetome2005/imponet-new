// context/CarritoContext.jsx
import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { getProductosPorIds } from "../services/productos.services";

const STORAGE_KEY = "carrito";

const readCarritoStorage = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch (e) {
        console.log(e);
        return [];
    }
};

const writeCarritoStorage = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {

    const [itemsRaw, setItemsRaw] = useState(readCarritoStorage);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const refetchProductos = useCallback(async (items) => {
        const idsValidos = items.map((i) => i.producto_id).filter(Boolean);
        if (!idsValidos.length) {
            setProductos([]);
            return;
        }
        setLoading(true);
        try {
            const data = await getProductosPorIds(idsValidos);
            setProductos(data);

            // Si algún id pedido no vino en la respuesta, el producto ya no existe/está inactivo
            const idsEncontrados = new Set(data.map((p) => p.id));
            const hayFantasmas = idsValidos.some((id) => !idsEncontrados.has(id));

            if (hayFantasmas) {
                setItemsRaw((prev) => {
                    const limpio = prev.filter((i) => idsEncontrados.has(i.producto_id));
                    writeCarritoStorage(limpio);
                    return limpio;
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetchProductos(itemsRaw);
    }, [itemsRaw, refetchProductos]);

    const addItem = (producto_id, cantidad = 1) => {
        if (!producto_id) return;
        setItemsRaw((prev) => {
            const existing = prev.find((i) => i.producto_id === producto_id);
            const updated = existing
                ? prev.map((i) => i.producto_id === producto_id ? { ...i, cantidad: i.cantidad + cantidad } : i)
                : [...prev, { producto_id, cantidad }];
            writeCarritoStorage(updated);
            return updated;
        });
    };

    const removeItem = (producto_id) => {
        setItemsRaw((prev) => {
            const updated = prev.filter((i) => i.producto_id !== producto_id);
            writeCarritoStorage(updated);
            return updated;
        });
    };

    const updateCantidad = (producto_id, cantidad) => {
        setItemsRaw((prev) => {
            const updated = prev.map((i) => i.producto_id === producto_id ? { ...i, cantidad } : i);
            writeCarritoStorage(updated);
            return updated;
        });
    };

    const clearCarrito = () => {
        setItemsRaw([]);
        writeCarritoStorage([]);
    };

    const carrito = itemsRaw
        .map((item) => {
            const producto = productos.find((p) => p.id === item.producto_id);
            if (!producto) return null;
            return { ...producto, cantidad: item.cantidad };
        })
        .filter(Boolean);

    const total = carrito.reduce((acc, item) => {
        const precioFinal = Math.round(item.precio * (1 - item.descuento / 100));
        return acc + precioFinal * item.cantidad;
    }, 0);

    const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CarritoContext.Provider value={{
            itemsRaw,
            carrito,
            total,
            cantidadTotal,
            loading,
            addItem,
            removeItem,
            updateCantidad,
            clearCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    );
}

export function useCarrito() {
    const context = useContext(CarritoContext);
    if (!context) throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
    return context;
}