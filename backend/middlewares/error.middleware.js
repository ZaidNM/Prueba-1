import { ZodError } from 'zod'

export const notFound = (req, res) => {
    res.status(404).json({ error: `Ruta ${req.method} ${req.path} no existe` })
}

// Express 5 envía aquí los errores de los controladores async
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Datos inválidos',
            detalles: err.issues.map((i) => ({
                campo: i.path.join('.'),
                mensaje: i.message
            }))
        })
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: err.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera los 5 MB' : 'Archivo no válido (usa JPG, PNG, WEBP, GIF o AVIF)'
        })
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un registro con esos datos' })
    }

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar: tiene coches asociados' })
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'La marca no existe' })
    }

    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
}
