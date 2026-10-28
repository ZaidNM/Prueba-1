import 'dotenv/config'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

if (!process.env.JWT_SECRET) throw new Error('Falta JWT_SECRET en el archivo .env')

export const PORT = process.env.PORT || 3000
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h'
export const CLIENT_URL = process.env.CLIENT_URL || '*'

export const UPLOADS_DIR = fileURLToPath(new URL('./uploads', import.meta.url))
mkdirSync(UPLOADS_DIR, { recursive: true })

export const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prueba_coches'
}
