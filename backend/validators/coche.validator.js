import { z } from 'zod'

export const COMBUSTIBLES = ['gasolina', 'diesel', 'electrico', 'hibrido', 'gas']

export const cocheSchema = z.object({
    marcaId: z.coerce.number().int().positive(),
    modelo: z.string().trim().min(1, 'El modelo es obligatorio').max(80),
    anio: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
    precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
    color: z.string().trim().min(1, 'El color es obligatorio').max(30),
    puertas: z.coerce.number().int().min(2).max(6),
    combustible: z.enum(COMBUSTIBLES),
    imagen: z.string().trim().max(255).optional()
})

export const cocheUpdateSchema = cocheSchema.partial()

export const cocheQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    marca: z.string().trim().min(1).optional(),
    precioMin: z.coerce.number().nonnegative().optional(),
    precioMax: z.coerce.number().nonnegative().optional(),
    anio: z.coerce.number().int().min(1900).optional(),
    combustible: z.enum(COMBUSTIBLES).optional(),
    q: z.string().trim().min(1).optional(),
    orden: z.enum(['recientes', 'precio_asc', 'precio_desc', 'anio_desc']).default('recientes')
})
