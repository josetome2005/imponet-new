import { z } from "zod"

const usuarioSchema = z.object({
    nombre: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    telefono: z.string().max(20).optional(),
    rol: z.enum(['cliente', 'admin']).default('cliente')
})

export const validateUsuario = (object) => usuarioSchema.safeParse(object)
export const validatePartialUsuario = (object) => usuarioSchema.partial().safeParse(object)