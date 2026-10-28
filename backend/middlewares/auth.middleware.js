import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')

    if (!token) return res.status(401).json({ error: 'Token requerido' })

    try {
        req.usuario = jwt.verify(token, JWT_SECRET)
        next()
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' })
    }
}
