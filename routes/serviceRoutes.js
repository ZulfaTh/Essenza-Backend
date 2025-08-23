import express from 'express'
import { serviceList } from '../controllers/serviceController.js'

const serviceRouter = express.Router()

serviceRouter.get('/list',serviceList)

export default serviceRouter;