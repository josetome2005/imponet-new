import { z } from "zod"

const itemSchema = z.object({
    producto_id: z.string().uuid(),
    cantidad: z.number().int().positive()
})

const ventaSchema = z.object({
    nombre: z.string().min(1).max(100),
    email: z.string().email(),
    telefono: z.string().max(20).optional(),
    direccion_calle: z.string().max(150).optional(),
    direccion_ciudad: z.string().max(100).optional(),
    direccion_provincia: z.string().max(100).optional(),
    direccion_cp: z.string().max(20).optional(),
    items: z.array(itemSchema).min(1)
})

const estadoSchema = z.object({
    estado: z.enum(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'])
})

export const validateVenta = (object) => ventaSchema.safeParse(object)
export const validateEstado = (object) => estadoSchema.safeParse(object)