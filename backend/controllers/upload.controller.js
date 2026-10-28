import { randomUUID } from 'node:crypto'
import multer from 'multer'
import { UPLOADS_DIR } from '../config.js'

const EXTENSIONES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif'
}

const almacen = multer.diskStorage({
    destination: UPLOADS_DIR,
    // Nombre aleatorio + extensión según el tipo: nunca se usa el nombre original
    filename: (req, archivo, cb) => cb(null, `${randomUUID()}${EXTENSIONES[archivo.mimetype]}`)
})

const subida = multer({
    storage: almacen,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, archivo, cb) =>
        EXTENSIONES[archivo.mimetype]
            ? cb(null, true)
            : cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'imagen'))
})

export const subirImagen = [
    subida.single('imagen'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'Falta la imagen' })

        res.status(201).json({ imagen: `/uploads/${req.file.filename}` })
    }
]
