import { Router } from 'express'
import { subirImagen } from '../controllers/upload.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/uploads', requireAuth, subirImagen)

export default router
