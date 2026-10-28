import { Router } from 'express'
import {
    getMarcas,
    getMarca,
    createMarca,
    updateMarca,
    deleteMarca
} from '../controllers/marca.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validId } from '../middlewares/id.middleware.js'

const router = Router()

router.get('/marcas', getMarcas)
router.get('/marcas/:id', validId, getMarca)

router.post('/marcas', requireAuth, createMarca)
router.put('/marcas/:id', requireAuth, validId, updateMarca)
router.delete('/marcas/:id', requireAuth, validId, deleteMarca)

export default router
