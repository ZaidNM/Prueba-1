import { z } from 'zod'

export const marcaSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(50)
})
