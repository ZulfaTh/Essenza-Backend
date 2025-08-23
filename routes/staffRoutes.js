import express from 'express'
import { staffList } from '../controllers/staffController.js'

const staffRouter = express.Router()

staffRouter.get('/list',staffList)

export default staffRouter;