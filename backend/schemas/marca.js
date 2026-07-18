import { z } from "zod"

const marcaSchema = z.object({
    nombre: z.string().min(1).max(100)
})

export const validateMarca = (object) => marcaSchema.safeParse(object)
export const validatePartialMarca = (object) => marcaSchema.partial().safeParse(object)