import { Router } from 'express'
import {
  create,
  duplicate,
  getById,
  getPublic,
  list,
  publish,
  remove,
  unpublish,
  update,
} from '../controllers/portfolioController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/public/:slug', getPublic)
router.use('/portfolios', requireAuth)
router.get('/portfolios', list)
router.post('/portfolios', create)
router.get('/portfolios/:id', getById)
router.put('/portfolios/:id', update)
router.delete('/portfolios/:id', remove)
router.post('/portfolios/:id/duplicate', duplicate)
router.post('/portfolios/:id/publish', publish)
router.post('/portfolios/:id/unpublish', unpublish)

export default router