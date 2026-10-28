import { Router } from 'express'
import {
    getCoches,
    getCoche,
    createCoche,
    updateCoche,
    deleteCoche
} from '../controllers/coche.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validId } from '../middlewares/id.middleware.js'

const router = Router()

router.get('/coches', getCoches)
router.get('/coches/:id', validId, getCoche)

router.post('/coches', requireAuth, createCoche)
router.put('/coches/:id', requireAuth, validId, updateCoche)
router.delete('/coches/:id', requireAuth, validId, deleteCoche)

export default router
