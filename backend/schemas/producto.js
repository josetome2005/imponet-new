// schemas/producto.js
import { z } from "zod"

const productoSchema = z.object({
    marca_id: z.string().uuid().nullable().optional(),
    nombre: z.string().min(1).max(150),
    descripcion: z.string().optional(),
    precio: z.number().int().nonnegative(),
    descuento: z.number().int().min(0).max(100).default(0),
    stock: z.number().int().nonnegative().default(0),
    dimensiones: z.string().max(50).optional(),
    extra: z.string().max(100).optional(),
    activo: z.boolean().default(true),
    destacado: z.boolean().default(false),
    categoria_ids: z.array(z.string().uuid()).optional().default([]),
    sku: z.string().nullable().optional()
})

export const validateProducto = (object) => productoSchema.safeParse(object)
export const validatePartialProducto = (object) => productoSchema.partial().safeParse(object)

const idsSchema = z.object({
    ids: z.array(z.string().uuid()).min(1).max(50)
})
export const validateIds = (object) => idsSchema.safeParse(object)
