import { z } from "zod"

const emailSchema = z.object({
    email: z.string().email()
})

export const validateEmail = (object) => emailSchema.safeParse(object)