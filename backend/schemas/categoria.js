import { z } from "zod"

const categoriaSchema = z.object({
    nombre: z.string().min(1).max(100)
})

export const validateCategoria = (object) => categoriaSchema.safeParse(object)
export const validatePartialCategoria = (object) => categoriaSchema.partial().safeParse(object)