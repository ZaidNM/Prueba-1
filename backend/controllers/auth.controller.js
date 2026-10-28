import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { JWT_EXPIRES, JWT_SECRET } from '../config.js'
import { loginSchema } from '../validators/auth.validator.js'

export const login = async (req, res) => {
    const { email, password } = loginSchema.parse(req.body)

    const [filas] = await pool.query(
        'SELECT id, email, password FROM usuarios WHERE email = ?',
        [email]
    )
    const usuario = filas[0]
    const passwordOk = usuario && (await bcrypt.compare(password, usuario.password))

    if (!passwordOk) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ sub: usuario.id, email: usuario.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    })

    res.json({ token, usuario: { id: usuario.id, email: usuario.email } })
}
