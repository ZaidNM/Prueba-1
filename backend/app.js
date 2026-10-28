import express from 'express'
import cors from 'cors'
import { readFileSync } from 'node:fs'
import swaggerUi from 'swagger-ui-express'

import { CLIENT_URL, UPLOADS_DIR } from './config.js'
import authRoutes from './routes/auth.routes.js'
import marcaRoutes from './routes/marca.routes.js'
import cocheRoutes from './routes/coche.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js'

const openapi = JSON.parse(
    readFileSync(new URL('./docs/openapi.json', import.meta.url), 'utf8')
)

export const app = express()

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json())

app.use('/uploads', express.static(UPLOADS_DIR))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))
app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api', authRoutes, marcaRoutes, cocheRoutes, uploadRoutes)

app.use(notFound)
app.use(errorHandler)
